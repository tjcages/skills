import {
  SOUNDS,
  canonicalSound,
  replaceCueSounds,
  resolveCues,
  synthesize,
  validateEffects,
} from "./effects.mjs";
export function createEffectsEditor({
  video,
  getDuration,
  getContext,
  changed,
}) {
  const $ = (id) => document.getElementById(id);
  let cues = [],
    edit,
    sheet,
    selected,
    replacement;
  const fields = () => ({
    fps: 30,
    effects: cues.map((c) => ({ ...c })),
    effectsEnabled: $("effectsEnabled").checked,
    effectsVolume: Number($("effectsVolume").value),
    effectsSpeed: Number($("effectsSpeed").value),
  });
  const button = (text, action, label) => {
    const b = document.createElement("button");
    b.textContent = text;
    b.onclick = action;
    if (label) b.setAttribute("aria-label", label);
    return b;
  };
  function select(cue, seek = true) {
    selected = cue.id;
    $("effectsTab").click();
    if (seek) {
      changed();
      video.currentTime = cue.frame / 30;
    }
    draw();
  }
  function inspect(cue) {
    const panel = $("cueInspector");
    panel.replaceChildren();
    if (!cue) {
      panel.textContent = "Select a sound on the timeline to edit it.";
      return;
    }
    const title = document.createElement("div");
    title.className = "cue-title";
    title.textContent = "Selected sound";
    panel.append(title);
    function field(text, input) {
      const label = document.createElement("label");
      label.textContent = text;
      label.append(input);
      panel.append(label);
      return input;
    }
    const name = field("Action", document.createElement("input"));
    name.type = "text";
    name.value = cue.label;
    name.maxLength = 120;
    name.onchange = () => {
      cue.label = name.value;
      changed();
      draw();
    };
    const sound = field("Cuelume sound", document.createElement("select"));
    Object.keys(SOUNDS).forEach((n) => sound.add(new Option(n, n)));
    sound.value = cue.sound;
    sound.onchange = () => {
      cue.sound = sound.value;
      changed();
      draw();
    };
    const frame = field(
      "Frame · 30 frames = 1 second",
      document.createElement("input"),
    );
    frame.type = "number";
    frame.min = 0;
    frame.max = Math.max(0, Math.ceil(getDuration() * 30) - 1);
    frame.step = 1;
    frame.value = cue.frame;
    frame.onchange = () => {
      if (!frame.reportValidity()) {
        frame.value = cue.frame;
        return;
      }
      cue.frame = Number(frame.value);
      changed();
      draw();
    };
    const volume = field("Sound volume", document.createElement("input"));
    volume.type = "range";
    volume.min = 0;
    volume.max = 1;
    volume.step = 0.01;
    volume.value = cue.volume;
    volume.oninput = () => {
      cue.volume = Number(volume.value);
      changed();
    };
    const actions = document.createElement("div");
    actions.className = "cue-actions";
    actions.append(
      button(
        "▷ Listen",
        async () => {
          changed();
          const ctx = getContext();
          await ctx.resume();
          const pcm = synthesize(cue.sound, ctx.sampleRate),
            buffer = ctx.createBuffer(1, pcm.length, ctx.sampleRate);
          buffer.copyToChannel(pcm, 0);
          const node = ctx.createBufferSource(),
            gain = ctx.createGain();
          node.buffer = buffer;
          node.playbackRate.value = Number($("effectsSpeed").value);
          gain.gain.value = cue.volume * Number($("effectsVolume").value);
          node.connect(gain).connect(ctx.destination);
          node.start();
          node.onended = () => {
            node.disconnect();
            gain.disconnect();
          };
        },
        `Hear ${cue.label}`,
      ),
      button(
        "Remove",
        () => {
          cues = cues.filter((c) => c.id !== cue.id);
          selected = undefined;
          changed();
          draw();
        },
        `Remove ${cue.label}`,
      ),
    );
    panel.append(actions);
  }
  function draw() {
    $("cueList").replaceChildren();
    $("cueTrack").replaceChildren();
    $("cueCount").textContent = `${cues.length} cues`;
    $("trackCueCount").textContent = `${cues.length} sounds`;
    const duration =
      getDuration() ||
      edit?.cuts.reduce((n, c) => n + c.out - c.in, 0) / 30 ||
      1;
    const query = $("cueSearch").value.trim().toLowerCase();
    const ends = [0, 0, 0, 0, 0];
    for (const cue of [...cues].sort((a, b) => a.frame - b.frame)) {
      if ((cue.label + " " + cue.sound).toLowerCase().includes(query)) {
        const item = button("", () => select(cue));
        item.className = "cue-item";
        item.setAttribute("aria-pressed", String(selected === cue.id));
        const label = document.createElement("span");
        label.textContent = cue.label;
        const at = document.createElement("small");
        at.textContent = (cue.frame / 30).toFixed(2) + "s";
        item.append(label, at);
        $("cueList").append(item);
      }
      const at = cue.frame / 30,
        length =
          synthesize(cue.sound).length /
          48000 /
          Number($("effectsSpeed").value);
      let lane = ends.findIndex((end) => end <= at);
      if (lane < 0) lane = ends.indexOf(Math.min(...ends));
      ends[lane] = at + Math.max(0.12, length);
      const marker = button("", () => select(cue), `Edit ${cue.label}`);
      marker.className = "cue-marker";
      marker.style.left = `${(at / duration) * 100}%`;
      marker.style.width = `${Math.max(0.35, (Math.min(length, duration - at) / duration) * 100)}%`;
      marker.style.top = `${5 + lane * 14}px`;
      marker.title = `${cue.label} · ${at.toFixed(2)}s`;
      marker.setAttribute("aria-pressed", String(selected === cue.id));
      $("cueTrack").append(marker);
    }
    inspect(cues.find((c) => c.id === selected));
    window.dispatchEvent(new Event("editor-change"));
  }
  function loadSheet(data) {
    if (!edit) throw Error("A scene cue sheet needs the matching film edit.");
    const next = resolveCues(edit, data);
    validateEffects({
      duration:
        getDuration() || edit.cuts.reduce((n, c) => n + c.out - c.in, 0) / 30,
      musicEnabled: false,
      ...fields(),
      effects: next,
    });
    replacement = undefined;
    sheet = data;
    cues = next;
    selected = undefined;
    changed();
    draw();
  }
  $("addCue").onclick = () => {
    if (!getDuration()) return;
    const cue = {
      id: crypto.randomUUID(),
      label: "New sound",
      sound: "press",
      frame: Math.min(
        Math.ceil(getDuration() * 30) - 1,
        Math.round(video.currentTime * 30),
      ),
      volume: 0.5,
    };
    cues.push(cue);
    changed();
    select(cue, false);
  };
  $("restoreCues").onclick = () => {
    if (sheet && edit) loadSheet(sheet);
  };
  $("cueFile").onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      if (file.size > 100000) throw Error("Cue sheet is too large.");
      loadSheet(JSON.parse(await file.text()));
      $("status").textContent = "Scene cues imported.";
    } catch (error) {
      $("status").textContent = error.message;
    }
  };
  $("cueSearch").oninput = draw;
  $("effectsEnabled").onchange = changed;
  $("effectsVolume").oninput = changed;
  draw();
  return {
    fields,
    snapshot: () => ({ edit, sheet, selected, replacement }),
    restore(mix, state) {
      validateEffects(mix);
      cues = mix.effects.map((c) => ({ ...c }));
      edit = state?.edit;
      sheet = state?.sheet;
      selected = state?.selected;
      replacement = state?.replacement;
      draw();
    },
    selectCue(id) {
      const cue = cues.find((c) => c.id === id);
      if (cue) select(cue);
    },
    replaceSounds(from, to) {
      if (from === to) return 0;
      const before = cues.filter((c) => canonicalSound(c.sound) === from);
      if (!before.length) return 0;
      const next = replaceCueSounds(cues, from, to);
      replacement = {
        before: before.map((c) => ({ id: c.id, sound: c.sound })),
        to,
      };
      cues = next;
      changed();
      draw();
      return before.length;
    },
    canUndoReplacement: () => !!replacement,
    undoReplacement() {
      if (!replacement) return;
      const previous = new Map(replacement.before.map((c) => [c.id, c.sound]));
      cues = cues.map((c) =>
        previous.has(c.id) && c.sound === replacement.to
          ? { ...c, sound: previous.get(c.id) }
          : c,
      );
      replacement = undefined;
      changed();
      draw();
    },
    selected: () => cues.find((c) => c.id === selected),
    patchSelected(patch) {
      const cue = cues.find((c) => c.id === selected);
      if (!cue) return;
      const next = { ...cue, ...patch };
      if (
        !Number.isInteger(next.frame) ||
        next.frame < 0 ||
        next.frame >= Math.ceil(getDuration() * 30)
      )
        return;
      if (
        !SOUNDS[next.sound] ||
        !Number.isFinite(next.volume) ||
        next.volume < 0 ||
        next.volume > 1
      )
        return;
      Object.assign(cue, next);
      changed();
      draw();
    },
    draw,
    loadSheet,
    setEdit(value) {
      edit = value;
      if (!edit) {
        replacement = undefined;
        cues = [];
        sheet = null;
        selected = undefined;
        draw();
        changed();
      }
    },
  };
}
