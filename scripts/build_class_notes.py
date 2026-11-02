#!/usr/bin/env python3
"""Build the Class Notes viewer data from an HTML export of the notes doc.

usage: build_class_notes.py NOTES.html IMAGE_MAP.json ASSET_DIR
  IMAGE_MAP.json maps  "blob/<id>" -> "<local image file name inside ASSET_DIR>"
Writes public/class-notes/<class>/<page>.html, public/class-notes/img/*, public/class-notes/index.json
"""
import json, re, shutil, sys, html
from pathlib import Path

src, imap_path, asset_dir = sys.argv[1:4]
root = Path(__file__).resolve().parent.parent
out = root / 'public' / 'class-notes'
cls = 'mac272'
# Only MAC 272 is rebuilt. Other classes (added with add_class_notes.py) are left alone.
old_index = json.loads((out / 'index.json').read_text(encoding='utf-8')) if (out / 'index.json').exists() else {'classes': []}
if (out / cls).exists():
    shutil.rmtree(out / cls)
(out / cls).mkdir(parents=True)
(out / 'img').mkdir(exist_ok=True)

text = Path(src).read_text(encoding='utf-8')
imap = json.loads(Path(imap_path).read_text())

# privacy: made-up address instead of the real one
text = text.replace('32-50 93rd St, East Elmhurst, NY 11369', '123 Main St, Queens, NY 11101')
assert 'Elmhurst' not in text and '93rd' not in text

# drop the byline paragraph (date + mention) and the H1
text = re.sub(r'<h1[^>]*>.*?</h1>\s*', '', text, count=1, flags=re.S)
text = re.sub(r'<p><time.*?</p>\s*', '', text, count=1, flags=re.S)
text = text.replace('(Today)', '').replace(' </h2>', '</h2>')

# images
def img(m):
    key = m.group(1)
    name = imap[key]
    shutil.copy(Path(asset_dir) / name, out / 'img' / name)
    return f'src="__BASE__class-notes/img/{name}" loading="lazy"'
text = re.sub(r'src="(blob/[^"]+)"', img, text)

# split on H2
parts = re.split(r'(?=<h2 id=")', text)
intro, sections = parts[0], parts[1:]
secs = {}
for s in sections:
    m = re.match(r'<h2 id="([^"]+)">(.*?)</h2>', s, re.S)
    secs[m.group(1)] = (re.sub(r'<[^>]+>', '', html.unescape(m.group(2))).strip(), s)

def h3s(body):
    return [{'id': a, 'title': re.sub(r'<[^>]+>', '', html.unescape(t)).strip()}
            for a, t in re.findall(r'<h3 id="([^"]+)">(.*?)</h3>', body, re.S)]

# (folder title, [(page slug, page title, [h2 ids])])
def find(prefix):
    return [k for k in secs if k.startswith(prefix)]
layout = [
  ('Overview', [('overview', 'About these notes', None)]),
  ('Week 1', [('week-1', 'Introduction to PHP, MySQL and career notes', find('week-1') + ['introduction-to-mysql', 'career-notes'])]),
  ('Week 2', [('week-2-day-1', 'Day 1 — Our first PHP program', find('week-2-day-1')),
              ('week-2-day-2', 'Day 2 — Order form', find('week-2-day-2'))]),
  ('CodeCademy - PHP', [('codecademy-php', 'Extra practice', find('codecademy'))]),
  ('Week 3', [('week-3-day-1', 'Day 1 — Type juggling, loops, Lab #1', find('week-3-day-1')),
              ('week-3-day-2', 'Day 2 — Numbers, strings, casting, arrays', find('week-3-day-2') + ['1-arrays'])]),
  ('Week 4', [('week-4-day-1', 'Day 1 — Strict types, functions, scope, Lab #2', find('week-4-day-1')),
              ('week-4-day-2', 'Day 2 — Forms, GET vs POST, Lab #3', find('week-4-day-2'))]),
  ('Week 5', [('week-5-day-1', 'Day 1 — Form validation, Assignment 1', find('week-5-day-1')),
              ('week-5-day-2', 'Day 2 — Sessions and cookies', find('week-5-day-2'))]),
  ('Week 6', [('week-6-day-1', 'Day 1 — CRUD, SQL, MySQL with PHP', find('week-6-day-1')),
              ('week-6-day-2', 'Day 2 — Midterm review and quizzes', find('week-6-day-2'))]),
  ('Project 1', [('project-1', 'Deliverable 1 — Project proposal', find('project-1'))]),
  ('Midterm Reviews', [('midterm-reviews', 'Review sheets by lesson', find('midterm-reviews'))]),
]
used = set()
other = {k: v for k, v in secs.items() if re.match(r'mac-\d+-', k)}
secs = {k: v for k, v in secs.items() if k not in other}
folders = []
for ftitle, pages in layout:
    plist = []
    for slug, ptitle, ids in pages:
        if ids is None:
            body = intro
        else:
            body = ''.join(secs[i][1] for i in ids)
            used.update(ids)
        body = body.replace('__BASE__', '__BASE__')
        (out / cls / f'{slug}.html').write_text(body, encoding='utf-8')
        plist.append({'slug': slug, 'title': ptitle, 'topics': h3s(body)})
    folders.append({'title': ftitle, 'pages': plist})
assert used == set(secs), set(secs) - used  # every MAC 272 section is placed

classes = [{'id': cls, 'title': 'MAC 272 - WEB DEVELOPMENT 2', 'folders': folders}]
# Other classes: each H2 that starts with "MAC ### —" becomes its own class with one "Notes" page.
for k, (title, body) in other.items():
    m = re.match(r'(MAC \d+)\s*[—-]\s*(.*)', title)
    code, name = m.group(1), m.group(2).upper()
    cid = code.lower().replace(' ', '')
    (out / cid).mkdir(exist_ok=True)
    (out / cid / 'notes.html').write_text(body, encoding='utf-8')
    classes.append({'id': cid, 'title': f'{code} - {name}',
                    'folders': [{'title': 'Overview', 'pages': [{'slug': 'notes', 'title': 'Notes', 'topics': h3s(body)}]}]})
# Classes already on the blog but not in this doc keep their existing pages and entry.
have = {c['id'] for c in classes}
classes += [c for c in old_index['classes'] if c['id'] not in have]
index = {'classes': classes}
(out / 'index.json').write_text(json.dumps(index, indent=1, ensure_ascii=False), encoding='utf-8')
print('pages:', sum(len(f['pages']) for f in folders), 'images:', len(list((out / 'img').iterdir())))
