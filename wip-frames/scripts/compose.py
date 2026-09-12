#!/usr/bin/env python3
"""Compose WIP approval boards: padded, centered screens on a dotted mat."""

from __future__ import annotations

import argparse
import re
from collections import deque
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

# Off-white / super-subtle grey. Not tan.
BG = (0xF5, 0xF5, 0xF5, 255)
DOT = (0xD2, 0xD2, 0xD2, 255)
PAD = 80
PAD_FLOOR = 64
GAP = 32
GAP_FLOOR = 24
DOT_STEP = 24
DOT_OFFSET = 12
DOT_R = 1
DESKTOP_RADIUS = 16
LONG_EDGE_CAP = 2400
MOBILE_MAX_W = 500
MOBILE_ASPECT = 0.72
TARGET_MOBILE_H = 872
SHADOW = True
PILL_W = 126
PILL_H = 37
PILL_Y = 11.5
STATUS_H = 78
PHONE_R = 47
# Pill matches the mat, reads as a cutout.
PILL = BG
TITLE_COLOR = (0x6B, 0x6B, 0x6B, 255)
TITLE_SIZE = 20
TITLE_GAP = 8
TITLE_FONTS = [
    "/System/Library/Fonts/SFNS.ttf",
    "/System/Library/Fonts/SFNSText.ttf",
    "/Library/Fonts/SF-Pro-Text-Regular.otf",
    "/Library/Fonts/Arial.ttf",
    "/usr/share/fonts/truetype/msttcorefonts/Arial.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
]
TITLE_FONT = next((f for f in TITLE_FONTS if Path(f).exists()), TITLE_FONTS[-1])
STATUS_BAR_ASSET = Path(__file__).resolve().parent / "assets" / "ios18-statusbar-alpha.png"
APPLE_THUMB = (0, 0, 0, 90)
APPLE_THUMB_W = 6
APPLE_INSET = 3


def is_mobile(w: int, h: int) -> bool:
    if w <= 0 or h <= 0:
        return False
    return w <= MOBILE_MAX_W or (w / h) < MOBILE_ASPECT


def is_chrome_grey(px) -> bool:
    r, g, b, a = px
    if a < 12:
        return True
    if max(r, g, b) - min(r, g, b) > 10:
        return False
    return 208 <= min(r, g, b) <= 238


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    w, h = size
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)
    r = max(0, min(radius, w // 2, h // 2))
    draw.rounded_rectangle((0, 0, w - 1, h - 1), radius=r, fill=255)
    return mask


def punch_corner_chrome(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    seen = bytearray(w * h)
    q: deque[tuple[int, int]] = deque()

    def push(x: int, y: int) -> None:
        if x < 0 or y < 0 or x >= w or y >= h:
            return
        i = y * w + x
        if seen[i]:
            return
        if not is_chrome_grey(px[x, y]):
            return
        seen[i] = 1
        q.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)

    while q:
        x, y = q.popleft()
        px[x, y] = (0, 0, 0, 0)
        push(x - 1, y)
        push(x + 1, y)
        push(x, y - 1)
        push(x, y + 1)
    return im


def crop_opaque(im: Image.Image) -> Image.Image:
    bbox = im.getbbox()
    return im.crop(bbox) if bbox else im


def apply_phone_mask(im: Image.Image) -> Image.Image:
    scale = im.width / 390
    r = max(20, round(PHONE_R * scale))
    mask = rounded_mask(im.size, r)
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(im, (0, 0))
    out.putalpha(mask)
    return out


def blank_status_with_pill(im: Image.Image):
    w, h = im.size
    scale = w / 390
    status_h = max(36, round(STATUS_H * scale))
    fill = (255, 255, 255, 255)
    y_sample = min(h - 1, status_h + 8)
    for x in range(w // 2 - 20, w // 2 + 20):
        px = im.getpixel((max(0, min(w - 1, x)), y_sample))
        if px[3] > 200:
            fill = (px[0], px[1], px[2], 255)
            break
    overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    ImageDraw.Draw(overlay).rectangle((0, 0, w, status_h), fill=fill)
    alpha = im.split()[-1]
    band_mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(band_mask).rectangle((0, 0, w, status_h), fill=255)
    overlay.putalpha(ImageChops.multiply(alpha, band_mask))
    im.alpha_composite(overlay)

    pill_w = max(20, round(PILL_W * scale))
    pill_h = max(10, round(PILL_H * scale))
    top = 0
    for y in range(h):
        if any(im.getpixel((x, y))[3] > 200 for x in range(w // 3, 2 * w // 3)):
            top = y
            break
    pill_y = top + round(PILL_Y * scale)
    pill_x = (w - pill_w) // 2
    ImageDraw.Draw(im).rounded_rectangle(
        (pill_x, pill_y, pill_x + pill_w, pill_y + pill_h),
        radius=pill_h // 2,
        fill=PILL,
    )
    return im, (pill_x, pill_y, pill_w, pill_h)


def _greyish(rgb: tuple[int, int, int]) -> bool:
    r, g, b = rgb[:3]
    return max(r, g, b) - min(r, g, b) <= 12


def _luma(rgb: tuple[int, int, int]) -> float:
    r, g, b = rgb[:3]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def apple_scrollbars(im: Image.Image) -> Image.Image:
    """Replace fat OS scrollbars with overlay Apple thumbs. No track."""
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()

    def col_profile(x: int) -> tuple[float, int]:
        lumas = []
        greys = 0
        for y in range(0, h, 2):
            c = px[x, y][:3]
            lumas.append(_luma(c))
            if _greyish(c):
                greys += 1
        n = max(1, len(lumas))
        return sum(lumas) / n, greys

    gutter_x = None
    for x in range(w - 1, max(w - 22, 0), -1):
        avg, greys = col_profile(x)
        # Track-like: very light grey, almost uniform
        if greys > (h // 2) * 0.35 and 230 <= avg <= 254:
            gutter_x = x
        elif gutter_x is not None and avg < 220:
            break
    if gutter_x is None:
        # still try a default last-14px if a mid-grey thumb is present
        thumb_hits = 0
        for y in range(h):
            c = px[w - 8, y][:3]
            if _greyish(c) and 90 <= _luma(c) <= 180:
                thumb_hits += 1
        if thumb_hits > 8:
            gutter_x = w - 14

    if gutter_x is not None:
        fill_x = max(0, gutter_x - 2)
        for y in range(h):
            fill = px[fill_x, y]
            for x in range(gutter_x, w):
                px[x, y] = fill
        # Apple overlay thumb
        thumb_h = max(28, round(h * 0.28))
        thumb_y = max(APPLE_INSET + 8, round(h * 0.08))
        x0 = w - APPLE_INSET - APPLE_THUMB_W
        overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
        ImageDraw.Draw(overlay).rounded_rectangle(
            (x0, thumb_y, x0 + APPLE_THUMB_W, thumb_y + thumb_h),
            radius=APPLE_THUMB_W // 2,
            fill=APPLE_THUMB,
        )
        im.alpha_composite(overlay)

    # Horizontal bar at the bottom, if present
    row_y = h - 1
    grey_run = 0
    for x in range(w):
        c = px[x, row_y][:3]
        if _greyish(c) and 80 <= _luma(c) <= 200:
            grey_run += 1
    if grey_run > w * 0.15:
        # paint last 8 rows from above
        src_y = max(0, h - 12)
        for y in range(h - 8, h):
            for x in range(w):
                px[x, y] = px[x, src_y]
        thumb_w = max(36, round(w * 0.22))
        thumb_x = max(APPLE_INSET + 8, round(w * 0.08))
        y0 = h - APPLE_INSET - APPLE_THUMB_W
        overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
        ImageDraw.Draw(overlay).rounded_rectangle(
            (thumb_x, y0, thumb_x + thumb_w, y0 + APPLE_THUMB_W),
            radius=APPLE_THUMB_W // 2,
            fill=APPLE_THUMB,
        )
        im.alpha_composite(overlay)
    return im


def title_from_path(path: Path) -> str:
    stem = path.stem
    stem = re.sub(r"^\d+[-_]+", "", stem)
    stem = stem.replace("_", " ").replace("-", " ").strip()
    return stem[:1].upper() + stem[1:] if stem else path.stem


def title_font() -> ImageFont.FreeTypeFont:
    for path in TITLE_FONTS:
        if Path(path).exists():
            try:
                return ImageFont.truetype(path, TITLE_SIZE)
            except OSError:
                continue
    return ImageFont.load_default()


def title_band() -> int:
    return TITLE_SIZE + TITLE_GAP



def overlay_kit_status_bar(im: Image.Image, pill_box: tuple[int, int, int, int] | None = None) -> Image.Image:
    """Official Apple iOS kit Status Bar - iPhone, vertically centered on the pill."""
    if not STATUS_BAR_ASSET.exists():
        return im
    bar = Image.open(STATUS_BAR_ASSET).convert("RGBA")
    target_w = im.width
    target_h = max(1, round(bar.height * (target_w / bar.width)))
    bar = bar.resize((target_w, target_h), Image.Resampling.LANCZOS)
    bbox = bar.getbbox()
    content_h = (bbox[3] - bbox[1]) if bbox else target_h
    content_mid = (bbox[1] + bbox[3]) / 2 if bbox else target_h / 2
    w, h = im.size
    if pill_box:
        _, py, _, ph = pill_box
        pill_mid = py + ph / 2
    else:
        top = 0
        for y in range(h):
            if any(im.getpixel((x, y))[3] > 200 for x in range(w // 3, 2 * w // 3)):
                top = y
                break
        scale = w / 390
        pill_mid = top + round(PILL_Y * scale) + max(10, round(PILL_H * scale)) / 2
    y = int(round(pill_mid - content_mid))
    y = max(0, min(y, h - target_h))
    r, g, b, a = bar.split()
    a = a.point(lambda v: int(v * 0.50))
    bar = Image.merge("RGBA", (r, g, b, a))
    layer = Image.new("RGBA", im.size, (0, 0, 0, 0))
    layer.paste(bar, (0, y), bar)
    phone = im.split()[-1]
    layer.putalpha(ImageChops.multiply(layer.split()[-1], phone))
    im.alpha_composite(layer)
    return im


def prepare_mobile(im: Image.Image) -> Image.Image:
    im = punch_corner_chrome(im)
    im = crop_opaque(im)
    im = apply_phone_mask(im)
    im, pill_box = blank_status_with_pill(im)
    im = overlay_kit_status_bar(im, pill_box)
    return im


def prepare_desktop(im: Image.Image) -> Image.Image:
    im = apple_scrollbars(im.convert("RGBA"))
    mask = rounded_mask(im.size, DESKTOP_RADIUS)
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(im, (0, 0))
    out.putalpha(mask)
    return out


def load_screen(path: Path) -> Image.Image:
    im = Image.open(path)
    return im.convert("RGBA")


def scale_to_height(im: Image.Image, height: int) -> Image.Image:
    if im.height == height:
        return im
    if im.height < height:
        return im
    w = max(1, round(im.width * (height / im.height)))
    return im.resize((w, height), Image.Resampling.LANCZOS)


def classify(images: list[Image.Image]) -> str:
    kinds = ["mobile" if is_mobile(im.width, im.height) else "desktop" for im in images]
    if "desktop" in kinds and "mobile" in kinds:
        raise SystemExit("do not mix desktop and mobile on one board")
    if kinds[0] == "desktop" and len(images) > 1:
        raise SystemExit("one desktop per board")
    if kinds[0] == "mobile" and len(images) > 3:
        raise SystemExit("max 3 mobiles per board; make another")
    return kinds[0]


def paint_dots(canvas: Image.Image) -> None:
    draw = ImageDraw.Draw(canvas)
    w, h = canvas.size
    y = DOT_OFFSET
    while y < h:
        x = DOT_OFFSET
        while x < w:
            draw.ellipse((x - DOT_R, y - DOT_R, x + DOT_R, y + DOT_R), fill=DOT)
            x += DOT_STEP
        y += DOT_STEP


def place_screen(board: Image.Image, screen: Image.Image, x: int, y: int) -> None:
    s = screen
    if SHADOW:
        pad = 28
        shadow = Image.new("RGBA", (s.width + pad * 2, s.height + pad * 2), (0, 0, 0, 0))
        blob = Image.new("RGBA", (s.width, s.height), (0, 0, 0, 22))
        if s.mode == "RGBA":
            blob.putalpha(Image.eval(s.split()[-1], lambda a: 22 if a > 8 else 0))
        shadow.paste(blob, (pad, pad + 4), blob)
        shadow = shadow.filter(ImageFilter.GaussianBlur(10))
        board.alpha_composite(shadow, (x - pad, y - pad))
    board.alpha_composite(s, (x, y))


def compose(
    paths: list[Path],
    out: Path,
    pad: int = PAD,
    gap: int = GAP,
    titles: list[str] | None = None,
) -> Path:
    pad = max(PAD_FLOOR, pad)
    gap = max(GAP_FLOOR, gap)
    raw = [load_screen(p) for p in paths]
    kind = classify(raw)
    if kind == "mobile":
        screens = [prepare_mobile(im) for im in raw]
        target_h = min(im.height for im in screens)
        if all(abs(im.height - TARGET_MOBILE_H) < 80 for im in screens):
            target_h = min(target_h, TARGET_MOBILE_H)
        screens = [scale_to_height(im, target_h) for im in screens]
    else:
        screens = [prepare_desktop(im) for im in raw]

    if titles is None:
        titles = [title_from_path(p) for p in paths]
    while len(titles) < len(screens):
        titles.append("")

    tb = title_band()
    cluster_w = sum(im.width for im in screens) + gap * (len(screens) - 1)
    cluster_h = max(im.height for im in screens) + tb
    board_w = cluster_w + pad * 2
    board_h = cluster_h + pad * 2

    long_edge = max(board_w, board_h)
    if long_edge > LONG_EDGE_CAP:
        scale = LONG_EDGE_CAP / long_edge
        screens = [
            im.resize(
                (max(1, round(im.width * scale)), max(1, round(im.height * scale))),
                Image.Resampling.LANCZOS,
            )
            for im in screens
        ]
        cluster_w = sum(im.width for im in screens) + gap * (len(screens) - 1)
        cluster_h = max(im.height for im in screens) + tb
        board_w = cluster_w + pad * 2
        board_h = cluster_h + pad * 2

    board = Image.new("RGBA", (board_w, board_h), BG)
    paint_dots(board)
    font = title_font()
    draw = ImageDraw.Draw(board)
    x = pad
    for i, screen in enumerate(screens):
        sy = pad + tb + (cluster_h - tb - screen.height) // 2
        if titles[i]:
            draw.text((x, sy - TITLE_GAP - TITLE_SIZE), titles[i], font=font, fill=TITLE_COLOR)
        place_screen(board, screen, x, sy)
        x += screen.width + gap

    out.parent.mkdir(parents=True, exist_ok=True)
    rgb = Image.new("RGB", board.size, BG[:3])
    rgb.paste(board, mask=board.split()[-1])
    rgb.save(out, "PNG", optimize=True)
    return out


def main() -> None:
    p = argparse.ArgumentParser(description="Compose a WIP approval board")
    p.add_argument("--out", required=True, type=Path)
    p.add_argument("--pad", type=int, default=PAD)
    p.add_argument("--gap", type=int, default=GAP)
    p.add_argument("--titles", default="", help="Comma-separated titles, else derived from filenames")
    p.add_argument("screens", nargs="+", type=Path)
    args = p.parse_args()
    titles = [t.strip() for t in args.titles.split(",") if t.strip()] or None
    path = compose(args.screens, args.out, pad=args.pad, gap=args.gap, titles=titles)
    print(path)


if __name__ == "__main__":
    main()
