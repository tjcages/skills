#!/usr/bin/env python3
"""Fetch repository heads cheaply; preserve review evidence and report changes only."""
import argparse
import concurrent.futures
import datetime
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile


def inspect(entry):
    match = re.fullmatch(r'https://github.com/([\w.-]+/[\w.-]+)/?', entry['source'])
    if not match:
        return None
    repo = match.group(1)
    try:
        result = subprocess.run(['gh', 'api', f'repos/{repo}/commits', '-f', 'per_page=1', '--method', 'GET'], capture_output=True, text=True, timeout=25, check=True)
        commit = json.loads(result.stdout)[0]
        return {'id': entry['id'], 'sha': commit['sha'], 'url': commit['html_url'], 'subject': commit['commit']['message'].splitlines()[0][:240], 'reviewed_sha': entry.get('source_commit')}
    except (OSError, subprocess.SubprocessError, ValueError, KeyError, IndexError):
        return {'id': entry['id'], 'error': 'Source check failed; review status unchanged'}


def compare(current, previous):
    old = {item['id']: item for item in previous}
    return [item for item in current if item.get('error') or item.get('sha') != old.get(item['id'], {}).get('sha', item.get('reviewed_sha'))]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--state', type=Path, required=True, help='Private local observation file; never the reviewed catalogue')
    args = parser.parse_args()
    catalogue = json.loads((Path(__file__).resolve().parent.parent / 'references/jev-catalogue.json').read_text())
    previous = json.loads(args.state.read_text())['observations'] if args.state.exists() else []
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        current = [item for item in pool.map(inspect, catalogue['entries']) if item]
    report = {'checked_at': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'observations': current}
    changes = compare(current, previous)
    args.state.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(mode='w', dir=args.state.parent, delete=False) as tmp:
        json.dump(report, tmp, indent=2)
        temp = tmp.name
    os.replace(temp, args.state)
    print(json.dumps({'checked': len(current), 'changes': changes, 'model_calls': 0}, indent=2))
    return 1 if any('error' in item for item in current) else 0


if __name__ == '__main__':
    raise SystemExit(main())
