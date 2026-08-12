#!/usr/bin/env python3
"""ep01.md 콘티를 웹툰처럼 읽는 HTML로 굽는다.

    python3 story/script/build-webtoon.py

읽는 것: story/script/ep01.md, story/script/webtoon.css
쓰는 것: story/script/ep01-webtoon.html
"""
import re, html, pathlib

HERE = pathlib.Path(__file__).resolve().parent
SRC  = HERE / 'ep01.md'
CSS  = HERE / 'webtoon.css'
OUT  = HERE / 'ep01-webtoon.html'

lines = SRC.read_text().split('\n')

# --- split: front matter / body / appendix ---
start = next(i for i, l in enumerate(lines) if l.startswith('# 0.'))
end   = next(i for i, l in enumerate(lines) if l.startswith('# 연출 메모'))
body  = lines[start:end]

# 컷 번호만 컷으로 잡는다 (P1 · A24 · M51 …).
# `**여자와 아이.**` 같은 굵은 서술은 컷이 아니라 본문이다.
PANEL = re.compile(r'^\*\*([A-Z]{1,2}\d{1,3})\*\*\s*(\[[^\]]*\])?\s*(.*)$')
SPEAK = re.compile(r'^([가-힣A-Za-z0-9 ]{1,10})[:：]\s*(.+)$')
CUE   = re.compile(r'^(나|효)\)\s*(.+)$')

def esc(s):
    s = html.escape(s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
    s = re.sub(r'\*(.+?)\*', r'<i>\1</i>', s)
    return s

# 0=흰 눈 · A~J=표백된 갈색 · K=벽 안 회색 · L~M=밤
PALETTE = {'0': 'snow', 'K': 'grey', 'L': 'night', 'M': 'night'}
def pal(key):
    return PALETTE.get(key, 'dust')

sections, cur, panel = [], None, None

def flush_panel():
    global panel
    if panel:
        cur['panels'].append(panel)
        panel = None

for raw in body:
    l = raw.rstrip()
    if l.startswith('# '):
        flush_panel()
        title = l[2:].strip()
        key = title.split('.')[0].strip()
        cur = {'key': key, 'title': title, 'pal': pal(key), 'panels': []}
        sections.append(cur)
        continue
    if cur is None:
        continue
    if l.startswith('> '):
        note = l[2:].strip()
        if panel:
            panel.setdefault('notes', []).append(note)
        else:
            cur.setdefault('notes', []).append(note)
        continue
    if l.strip() == '---':
        flush_panel()
        cur['panels'].append({'beat': True})
        continue
    m = PANEL.match(l)
    if m:
        flush_panel()
        num  = m.group(1).strip()
        kind = (m.group(2) or '').strip('[] ')
        rest = m.group(3).strip()
        panel = {'num': num, 'kind': kind, 'body': []}
        if rest:
            panel['body'].append(rest)
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
        mod = kind.replace('여백', '').strip(' ·')
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
        if b.startswith('*(') and b.endswith(')*'):
            out.append(f'<p class="aside">{esc(b[1:-1])}</p>'); continue
        out.append(f'<p class="desc">{esc(b)}</p>')
    for n in p.get('notes', []):
        out.append(f'<p class="note">{esc(n)}</p>')
    out.append('</div></article>')
    return '\n'.join(out)

parts = []
for s in sections:
    parts.append(f'<section class="sec" data-pal="{s["pal"]}">')
    parts.append(f'<header class="sechead"><span class="seckey" id="s-{s["key"]}">{esc(s["key"])}</span>'
                 f'<h2>{esc(s["title"])}</h2></header>')
    for n in s.get('notes', []):
        parts.append(f'<p class="note secnote">{esc(n)}</p>')
    for p in s['panels']:
        parts.append(render_panel(p))
    parts.append('</section>')
out_body = '\n'.join(parts)

counts = [(s['key'], s['title'].split('.', 1)[-1].strip(),
           len([p for p in s['panels'] if not p.get('beat')]), s['pal'])
          for s in sections]
total = sum(c[2] for c in counts)

toc = '\n'.join(
    f'<li data-pal="{p}"><a href="#s-{k}"><span class="tk">{k}</span>'
    f'<span class="tt">{html.escape(t)}</span><span class="tn">{n}</span></a></li>'
    for k, t, n, p in counts)

PAGE = f"""<!doctype html>
<html lang="ko">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>피폭 · 1화 — 새동네</title>
<style>
{CSS.read_text()}
</style>

<div class="wrap">
  <header class="mast">
    <p class="eyebrow">웹툰 세로 스크롤 콘티 · 2590</p>
    <h1>피폭<em>1화 — 새동네</em></h1>
    <p class="blurb">지도에 없는 마을에 열한 명이 산다. 평균 나이 백셋.
    어느 오후 DX-11 일곱 대가 마을을 비우러 들어왔고, 아무도 일어나지 않았다.
    그날 밤 하늘에서 아이가 하나 떨어진다.</p>

    <div class="stat">
      <div><b>{total}</b><span>컷</span></div>
      <div><b>{len(sections)}</b><span>파트</span></div>
      <div><b>4</b><span>초</span></div>
    </div>

    <div class="drain"><i></i><i></i><i></i><i></i></div>
    <div class="drain-cap"><span>흰 눈</span><span>표백된 갈색</span><span>회색</span><span>밤</span></div>
    <p class="blurb">색이 세 번 죽는다. 프롤로그의 흰 눈과 J의 흰 벽은 같은 흰색이고,
    마지막 두 파트에서 처음으로 <b>위</b>를 본다.</p>

    <ul class="toc">{toc}</ul>
  </header>
</div>

<div class="ctrl">
  <div class="ctrl-in">
    <b>읽기</b>
    <button id="b-notes" aria-pressed="true">연출 메모</button>
    <button id="b-tight" aria-pressed="false">여백 줄이기</button>
  </div>
</div>

<div class="wrap">
{out_body}

  <footer>
    <p class="eyebrow">연출 원칙</p>
    <p>압도적이라는 건 오래 싸우는 게 아니라 안 싸우는 것이다. 분이는 일어나지 않고,
    덕구는 콩을 계속 까고, 선생은 눈을 안 뜨고, 막내는 물동이를 쓴다.</p>
    <p>그리고 끝나고 나서 무릎이 아프다고 투덜댄다. 전투의 여파가 액션이 아니라
    관절통인 게 이 장면의 전부다.</p>
    <p>1화 내내 분이는 한 번도 일어나지 않는다. 아이가 하나 떨어지고 나서야 일어선다.
    그리고 아프다고 말한다.</p>
    <p><b>[여백]</b>은 빈 컷이 아니라 스크롤 시간이다. 위에서 줄일 수 있지만,
    원래 길이가 이 화의 호흡이다.</p>
  </footer>
</div>

<script>
(function(){{
  var b1=document.getElementById('b-notes'), b2=document.getElementById('b-tight');
  b1.addEventListener('click',function(){{
    var on=b1.getAttribute('aria-pressed')==='true';
    b1.setAttribute('aria-pressed',String(!on));
    document.body.classList.toggle('hide-notes',on);
  }});
  b2.addEventListener('click',function(){{
    var on=b2.getAttribute('aria-pressed')==='true';
    b2.setAttribute('aria-pressed',String(!on));
    document.body.classList.toggle('tight',!on);
  }});
}})();
</script>
"""

OUT.write_text(PAGE)
print(f"→ {OUT.name}  ·  {len(sections)}파트  {total}컷")
for k, t, n, p in counts:
    print(f"  {k:>2}  {t[:22]:<24} {n:>4}  {p}")
