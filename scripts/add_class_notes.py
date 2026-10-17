#!/usr/bin/env python3
"""Add (or replace) one class in the Class Notes viewer from an HTML export of its study guide.

usage: add_class_notes.py CLASS_ID GUIDE.html FOLDER_TITLE [OVERVIEW_H2_ID] [blob/<id>=IMAGE ...]
  CLASS_ID       an existing class in public/class-notes/index.json, e.g. mac232
  GUIDE.html     HTML export of the study guide doc (H1 title, H2 per chapter, H3 per topic)
  FOLDER_TITLE   tree folder that holds one page per H2, e.g. "Chapters"
  OVERVIEW_H2_ID optional H2 that is folded into the class's Overview page (e.g. how-this-guide-works); "-" for none
  blob/<id>=IMAGE  maps an image in the export to a local file, copied to public/class-notes/img/

The text before the first H2 (minus the H1 and byline) becomes the Overview page.
Bold-only paragraphs such as <p><strong>Key concepts</strong></p> become H3 topics.
Run it again with a newer export to update a class; other classes are left alone.
"""
import json, re, shutil, sys, html
from pathlib import Path

cid, src, folder_title = sys.argv[1:4]
overview_id = sys.argv[4] if len(sys.argv) > 4 and sys.argv[4] != '-' else None
images = dict(a.split('=', 1) for a in sys.argv[5:])
root = Path(__file__).resolve().parent.parent
out = root / 'public' / 'class-notes'
index_path = out / 'index.json'
index = json.loads(index_path.read_text(encoding='utf-8'))
entry = next(c for c in index['classes'] if c['id'] == cid)

text = Path(src).read_text(encoding='utf-8')
# drop the H1 and the byline paragraph (date + mention)
text = re.sub(r'<h1[^>]*>.*?</h1>\s*', '', text, count=1, flags=re.S)
text = re.sub(r'<p><time.*?</p>\s*', '', text, count=1, flags=re.S)
assert 'data-atom="mention"' not in text

def img(m):
    path = Path(images[m.group(1)])
    shutil.copy(path, out / 'img' / path.name)
    return f'src="__BASE__class-notes/img/{path.name}" loading="lazy"'
text = re.sub(r'src="(blob/[^"]+)"', img, text)
assert 'src="blob/' not in text

def plain(s):
    return re.sub(r'<[^>]+>', '', html.unescape(s)).strip()

def slugify(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

parts = re.split(r'(?=<h2 id=")', text)
intro, sections = parts[0], parts[1:]

def page_html(body, slug):
    # bold-only paragraphs -> H3 topics with ids unique within the page
    seen = {}
    def h3(m):
        title = plain(m.group(1))
        base = f'{slug}-{slugify(title)}'
        seen[base] = seen.get(base, 0) + 1
        hid = base if seen[base] == 1 else f'{base}-{seen[base]}'
        return f'<h3 id="{hid}">{m.group(1)}</h3>'
    return re.sub(r'<p><strong>([^<]+)</strong></p>', h3, body)

def topics(body):
    return [{'id': a, 'title': plain(t)} for a, t in re.findall(r'<h3 id="([^"]+)">(.*?)</h3>', body, re.S)]

cdir = out / cid
cdir.mkdir(exist_ok=True)
for old in cdir.glob('*.html'):
    old.unlink()

title_html = f'<h2 id="{cid}-overview">{html.escape(entry["title"])}</h2>\n'
overview = title_html + intro
pages = []
for s in sections:
    m = re.match(r'<h2 id="([^"]+)">(.*?)</h2>', s, re.S)
    hid, title = m.group(1), plain(m.group(2))
    if hid == overview_id:
        overview += re.sub(r'<h2 ', '<h3 ', s, count=1).replace('</h2>', '</h3>', 1)
        continue
    slug = hid
    body = page_html(s, slug)
    (cdir / f'{slug}.html').write_text(body, encoding='utf-8')
    pages.append({'slug': slug, 'title': title, 'topics': topics(body)})

(cdir / 'overview.html').write_text(overview, encoding='utf-8')
entry['folders'] = [
    {'title': 'Overview', 'pages': [{'slug': 'overview', 'title': 'About these notes', 'topics': []}]},
    {'title': folder_title, 'pages': pages},
]
index_path.write_text(json.dumps(index, indent=1, ensure_ascii=False), encoding='utf-8')
print(cid, 'pages:', len(pages) + 1, 'topics:', sum(len(p['topics']) for p in pages))
