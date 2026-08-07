import re, html, pathlib

src = pathlib.Path('/home/user/flmo/story/script/ep01.md').read_text()
lines = src.split('\n')

# --- split: front matter / body / appendix ---
start = next(i for i,l in enumerate(lines) if l.startswith('# 0.'))
end   = next(i for i,l in enumerate(lines) if l.startswith('# 연출 메모'))
front, body, appx = lines[:start], lines[start:end], lines[end:]

PANEL = re.compile(r'^\*\*([^*]+)\*\*\s*(\[[^\]]*\])?\s*(.*)$')
SPEAK = re.compile(r'^([가-힣A-Za-z0-9 ]{1,10})[:：]\s*(.+)$')
CUE   = re.compile(r'^(나|효)\)\s*(.+)$')

def esc(s):
    s = html.escape(s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
    s = re.sub(r'\*(.+?)\*', r'<i>\1</i>', s)
    return s

PALETTE = {'0':'snow','K':'grey'}
def pal(key):
    return PALETTE.get(key, 'dust')

sections, cur, panel = [], None, None

def flush_panel():
    global panel
    if panel: cur['panels'].append(panel); panel = None

for raw in body:
    l = raw.rstrip()
    if l.startswith('# '):
        flush_panel()
        title = l[2:].strip()
        key = title.split('.')[0].strip()
        cur = {'key': key, 'title': title, 'pal': pal(key), 'panels': []}
        sections.append(cur)
        continue
    if cur is None: continue
    if l.startswith('> '):
        note = l[2:].strip()
        if panel: panel.setdefault('notes', []).append(note)
        else: cur.setdefault('notes', []).append(note)
        continue
    if l.strip() == '---':
        flush_panel(); cur['panels'].append({'beat': True}); continue
    m = PANEL.match(l)
    if m:
        flush_panel()
        num, kind, rest = m.group(1).strip(), (m.group(2) or '').strip('[] '), m.group(3).strip()
        panel = {'num': num, 'kind': kind, 'body': []}
        if rest: panel['body'].append(rest)
        continue
    if not l.strip():
        continue
    if panel is not None:
        panel['body'].append(l.strip())
flush_panel()

# --- render ---
GAP = {'': 96, '길게': 210, '아주 길게': 360}

def render_panel(p):
    if p.get('beat'):
        return '<hr class="beat">'
    kind = p['kind']
    if kind.startswith('여백'):
        mod = kind.replace('여백','').strip(' ·')
        h = GAP.get(mod, 96)
        return (f'<div class="rest" style="--h:{h}px" aria-label="여백">'
                f'<span class="rest-n">{esc(p["num"])}</span></div>')
    out = [f'<article class="panel"><div class="pnum">{esc(p["num"])}</div><div class="pbody">']
    if kind:
        out.append(f'<span class="kind">{esc(kind)}</span>')
    for b in p['body']:
        c = CUE.match(b)
        if c:
            cls = 'narr' if c.group(1) == '나' else 'sfx'
            out.append(f'<p class="{cls}">{esc(c.group(2))}</p>'); continue
        s = SPEAK.match(b)
        if s and not b.startswith('*'):
            out.append(f'<p class="line"><span class="who">{esc(s.group(1))}</span>'
                       f'<span class="say">{esc(s.group(2))}</span></p>'); continue
        if b.startswith('*(') or b.startswith('*'):
            out.append(f'<p class="aside">{esc(b.strip("*"))}</p>'); continue
        out.append(f'<p class="desc">{esc(b)}</p>')
    for n in p.get('notes', []):
        out.append(f'<p class="note">{esc(n)}</p>')
    out.append('</div></article>')
    return '\n'.join(out)

parts = []
for s in sections:
    parts.append(f'<section class="sec" data-pal="{s["pal"]}">')
    parts.append(f'<header class="sechead"><span class="seckey">{esc(s["key"])}</span>'
                 f'<h2>{esc(s["title"])}</h2></header>')
    for n in s.get('notes', []):
        parts.append(f'<p class="note secnote">{esc(n)}</p>')
    for p in s['panels']:
        parts.append(render_panel(p))
    parts.append('</section>')

counts = []
for s in sections:
    n = len([p for p in s['panels'] if not p.get('beat')])
    counts.append((s['key'], s['title'].split('.',1)[-1].strip(), n, s['pal']))
total = sum(c[2] for c in counts)

toc = '\n'.join(
    f'<li data-pal="{p}"><a href="#s-{k}"><span class="tk">{k}</span>'
    f'<span class="tt">{html.escape(t)}</span><span class="tn">{n}</span></a></li>'
    for k,t,n,p in counts)

# add ids
out_body = '\n'.join(parts)
for k,_,_,_ in counts:
    out_body = out_body.replace(f'<span class="seckey">{k}</span>',
                                f'<span class="seckey" id="s-{k}">{k}</span>', 1)

pathlib.Path('/tmp/claude-0/-home-user-flmo/a858f579-45c6-52eb-aa64-e02fe4560b57/scratchpad/_body.html').write_text(out_body)
pathlib.Path('/tmp/claude-0/-home-user-flmo/a858f579-45c6-52eb-aa64-e02fe4560b57/scratchpad/_toc.html').write_text(toc)
print("sections:", len(sections), "panels:", total)
for c in counts: print(f"  {c[0]:>2}  {c[1][:22]:<24} {c[2]:>4}  {c[3]}")
