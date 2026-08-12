#!/usr/bin/env bash
# Lint a commit/PR message against pr-writing rules.
# Usage: pr-lint.sh [file]   (default: last commit message; "-" for stdin)
set -uo pipefail

src="${1:-}"
if [ -z "$src" ]; then msg=$(git log -1 --format=%B)
elif [ "$src" = "-" ]; then msg=$(cat)
else msg=$(cat "$src"); fi

fail=0
err() { printf '  ✗ %s\n' "$*"; fail=1; }
warn() { printf '  ! %s\n' "$*"; }

subject=$(printf '%s\n' "$msg" | sed -n 1p)
line2=$(printf '%s\n' "$msg" | sed -n 2p)
body=$(printf '%s\n' "$msg" | tail -n +3)
n=${#subject}

printf 'Subject (%d chars): %s\n' "$n" "$subject"

# Rule 2 — length
[ "$n" -gt 72 ] && err "subject is $n chars (hard limit 72)"
[ "$n" -gt 50 ] && [ "$n" -le 72 ] && warn "subject is $n chars (target 50)"

# Rule 3 — capitalized
case $subject in [A-Z]*) ;; *) err "subject must start with a capital letter" ;; esac

# Rule 4 — no trailing period
case $subject in *.) err "subject must not end with a period" ;; esac

# Rule 5 — imperative mood
first=${subject%% *}
case $(printf '%s' "$first" | tr 'A-Z' 'a-z') in
  *ed|*ing) err "'$first' is not imperative — try 'If applied, this commit will ___'" ;;
  wip|misc|various|cleanup|changes|stuff|minor|updates|fixes|adds)
    err "'$first' is banned — name the actual change" ;;
esac

# No emoji / ticket-prefix noise
printf '%s' "$subject" | LC_ALL=C grep -qP '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]' 2>/dev/null \
  && err "no emoji in the subject"
case $subject in \[*) err "no [bracket] tags in the subject" ;; esac

# Rule 1 — blank second line
if [ -n "$(printf '%s\n' "$msg" | sed -n '2,$p' | tr -d '[:space:]')" ] && [ -n "$line2" ]; then
  err "line 2 must be blank (git parses the title up to the first blank line)"
fi

# Rule 6 — body wrapped at 72 (skip code fences and bare URLs)
if [ -n "${body//[[:space:]]/}" ]; then
  fence=0; ln=2
  while IFS= read -r l; do
    ln=$((ln + 1))
    case ${l#"${l%%[![:space:]]*}"} in '```'*) fence=$((1 - fence)); continue ;; esac
    [ "$fence" -eq 1 ] && continue
    case $l in *http://*|*https://*) continue ;; esac
    [ "${#l}" -gt 72 ] && err "line $ln is ${#l} chars (wrap at 72)"
  done <<< "$body"
else
  warn "no body — acceptable only for a truly self-evident one-liner"
fi

# §4 — banned words. Strip fenced blocks and inline `code` spans first:
# quoting a bad message as an example is legal.
prose=$(printf '%s\n' "$msg" | awk '/^[ \t]*```/{f=!f; next} !f' | sed 's/`[^`]*`//g')
for w in simply just easily obviously please leverage utilize "in order to" \
         "under the hood" "out of the box" "low-hanging fruit" "we " "This PR"; do
  printf '%s' "$prose" | grep -qiF -- "$w" && err "banned word/phrase: '$w'"
done

[ "$fail" -eq 0 ] && printf '  ✓ passes pr-writing rules\n'
exit "$fail"
