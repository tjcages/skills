"""Read a small slice of EA's JEV catalogue without network or model calls."""
import argparse
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--query')
    group.add_argument('--id')
    parser.add_argument('--limit', type=int, choices=range(1, 21), default=5)
    args = parser.parse_args()
    data = json.loads((Path(__file__).resolve().parent.parent / 'references/jev-catalogue.json').read_text())
    entries = data['entries']
    if args.id:
        matches = [e for e in entries if e['id'] == args.id]
        if not matches:
            parser.error('Unknown catalogue ID')
        print(json.dumps(matches[0], indent=2))
        return
    words = args.query.lower().split()
    def score(entry):
        text = ' '.join(str(entry[k]) for k in ('id', 'name', 'kind', 'use_when', 'providers')).lower()
        return sum(word in text for word in words)
    matches = sorted((e for e in entries if score(e)), key=lambda e: -score(e))[:args.limit]
    keys = ('id', 'name', 'kind', 'recommendation', 'use_when', 'providers', 'installed_locally')
    print(json.dumps([{k: e[k] for k in keys} for e in matches], indent=2))


if __name__ == '__main__':
    main()
