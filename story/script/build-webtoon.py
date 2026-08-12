#!/usr/bin/env python3
"""콘티(epNN.md)를 웹툰처럼 읽는 HTML로 굽는다.

    python3 story/script/build-webtoon.py          # 있는 화 전부
    python3 story/script/build-webtoon.py ep02     # 한 화만

읽는 것: story/script/epNN.md, story/script/webtoon.css
쓰는 것: story/script/epNN-webtoon.html
"""
import re, sys, html, pathlib

HERE = pathlib.Path(__file__).resolve().parent
CSS  = HERE / 'webtoon.css'

# 화별 설정 — 새 화를 쓰면 여기에 한 덩어리 추가한다.
EPISODES = {
    'ep01': {
        'title': '피폭 · 1화 — 새동네',
        'sub': '1화 — 새동네',
        'blurb': '지도에 없는 마을에 열한 명이 산다. 평균 나이 백셋. '
                 '어느 오후 DX-11 일곱 대가 마을을 비우러 들어왔고, 아무도 일어나지 않았다. '
                 '그날 밤 하늘에서 아이가 하나 떨어진다.',
        # 0=흰 눈 · A~J=표백된 갈색 · K=벽 안 회색 · L~M=밤
        'pal': {'0': 'snow', 'K': 'grey', 'L': 'night', 'M': 'night'},
        'drain': [('snow', .9), ('dust', 8), ('grey', .6), ('night', 1.1)],
        'drain_cap': ['흰 눈', '표백된 갈색', '회색', '밤'],
        'drain_note': '색이 세 번 죽는다. 프롤로그의 흰 눈과 J의 흰 벽은 같은 흰색이고, '
                      '마지막 두 파트에서 처음으로 <b>위</b>를 본다.',
        'stat3': ('4', '초'),
        'footer': [
            ('연출 원칙',
             '압도적이라는 건 오래 싸우는 게 아니라 안 싸우는 것이다. 분이는 일어나지 않고, '
             '덕구는 콩을 계속 까고, 선생은 눈을 안 뜨고, 막내는 물동이를 쓴다.'),
            (None, '그리고 끝나고 나서 무릎이 아프다고 투덜댄다. 전투의 여파가 액션이 아니라 '
                   '관절통인 게 이 장면의 전부다.'),
            (None, '1화 내내 분이는 한 번도 일어나지 않는다. 아이가 하나 떨어지고 나서야 '
                   '일어선다. 그리고 아프다고 말한다.'),
        ],
    },
    'ep02': {
        'title': '피폭 · 2화 — 이름',
        'sub': '2화 — 이름',
        'blurb': '아이들이 번호를 받는 날. 세하는 001이 되고, 떨어진 아이는 자기를 '
                 '사백열둘이라고 부른다. 그날 밤 서쪽에서 마을 하나가 통째로 없어지고, '
                 '새벽에 말 한 마리가 혼자 걸어 들어온다.',
        # 0=새벽 · A,E,F,G=밖 · B,C,D=벽 안 회색 · H~L=카란 밤 · M,N=창고 등불
        'pal': {'0': 'night', 'B': 'grey', 'C': 'grey', 'D': 'grey',
                'H': 'karan', 'I': 'karan', 'J': 'karan', 'K': 'karan', 'L': 'karan',
                'M': 'lamp', 'N': 'lamp'},
        'drain': [('night', 1), ('dust', 3), ('grey', 3), ('karan', 4), ('lamp', 2)],
        'drain_cap': ['새벽', '표백된 갈색', '회색', '카란', '등불'],
        'drain_note': '따뜻한 색은 세 번만 나온다 — <b>붉은 달 · 화살통 안의 금빛 · '
                      '하늘의 불 고리.</b> 그 사이는 전부 차갑다.',
        'stat3': ('0', '전투'),
        'footer': [
            ('연출 원칙',
             '안개는 소리가 없다. 짐승 소리도 나고 바람 소리도 나고 천 소리도 나는데 '
             '다가오는 것만 조용하다. 이 시퀀스의 공포는 전부 거기서 나온다.'),
            (None, '비명이 없다. 노인은 소리 없이 없어지고 옷만 남는다. '
                   '그리고 거인이 그만한 크기로 걷는데 땅이 반응하지 않는다. '
                   '그 어긋남이 저것이 무엇인지 말한다.'),
            (None, '불의 고리는 지평선의 달과 같은 지름이어야 한다. '
                   '이 각운이 카란 시퀀스의 끝이다.'),
            (None, '1화는 하늘에서 아이가 떨어지며 끝났다. '
                   '2화는 땅에서 아이가 걸어 들어오며 끝난다.'),
        ],
    },
}

# 컷 번호만 컷으로 잡는다 (P1 · A24 · M51 …).
# `**여자와 아이.**` 같은 굵은 서술은 컷이 아니라 본문이다.
PANEL = re.compile(r'^\*\*([A-Z]{1,2}\d{1,3})\*\*\s*(\[[^\]]*\])?\s*(.*)$')
SPEAK = re.compile(r'^([가-힣A-Za-z0-9 ]{1,10})[:：]\s*(.+)$')
CUE   = re.compile(r'^(나|효)\)\s*(.+)$')
GAP   = {'': 96, '길게': 210, '아주 길게': 360}


def esc(s):
    s = html.escape(s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
    s = re.sub(r'\*(.+?)\*', r'<i>\1</i>', s)
    return s


def parse(md, palmap):
    """콘티 마크다운 → 파트 목록."""
    lines = md.split('\n')
    start = next(i for i, l in enumerate(lines) if l.startswith('# 0.'))
    end   = next(i for i, l in enumerate(lines) if l.startswith('# 연출 메모'))

    sections, cur, panel = [], None, None

    def flush():
        nonlocal panel
        if panel:
            cur['panels'].append(panel)
            panel = None

    for raw in lines[start:end]:
        l = raw.rstrip()
        if l.startswith('# '):
            flush()
            title = l[2:].strip()
            key = title.split('.')[0].strip()
            cur = {'key': key, 'title': title,
                   'pal': palmap.get(key, 'dust'), 'panels': []}
            sections.append(cur)
            continue
        if cur is None:
            continue
        if l.startswith('> '):
            note = l[2:].strip()
            (panel or cur).setdefault('notes', []).append(note)
            continue
        if l.strip() == '---':
            flush()
            cur['panels'].append({'beat': True})
            continue
        m = PANEL.match(l)
        if m:
            flush()
            panel = {'num': m.group(1).strip(),
                     'kind': (m.group(2) or '').strip('[] '),
                     'body': []}
            if m.group(3).strip():
                panel['body'].append(m.group(3).strip())
            continue
        if not l.strip():
            continue
        if panel is not None:
            panel['body'].append(l.strip())
    flush()
    return sections


def render_panel(p):
    if p.get('beat'):
        return '<hr class="beat">'
    kind = p['kind']
    if kind.startswith('여백'):
        h = GAP.get(kind.replace('여백', '').strip(' ·'), 96)
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


def build(ep):
    cfg = EPISODES[ep]
    src = HERE / f'{ep}.md'
    out = HERE / f'{ep}-webtoon.html'
    sections = parse(src.read_text(), cfg['pal'])

    parts = []
    for s in sections:
        parts.append(f'<section class="sec" data-pal="{s["pal"]}">')
        parts.append(f'<header class="sechead">'
                     f'<span class="seckey" id="s-{s["key"]}">{esc(s["key"])}</span>'
                     f'<h2>{esc(s["title"])}</h2></header>')
        for n in s.get('notes', []):
            parts.append(f'<p class="note secnote">{esc(n)}</p>')
        for p in s['panels']:
            parts.append(render_panel(p))
        parts.append('</section>')
    body = '\n'.join(parts)

    counts = [(s['key'], s['title'].split('.', 1)[-1].strip(),
               len([p for p in s['panels'] if not p.get('beat')]), s['pal'])
              for s in sections]
    total = sum(c[2] for c in counts)

    toc = '\n'.join(
        f'<li data-pal="{p}"><a href="#s-{k}"><span class="tk">{k}</span>'
        f'<span class="tt">{html.escape(t)}</span><span class="tn">{n}</span></a></li>'
        for k, t, n, p in counts)

    drain = ''.join(f'<i style="flex:{w};background:var(--{c})"></i>'
                    for c, w in cfg['drain'])
    drain_cap = ''.join(f'<span>{html.escape(t)}</span>' for t in cfg['drain_cap'])
    foot = '\n'.join(
        (f'    <p class="eyebrow">{html.escape(head)}</p>\n' if head else '')
        + f'    <p>{text}</p>'
        for head, text in cfg['footer'])
    n3, l3 = cfg['stat3']

    page = f"""<!doctype html>
<html lang="ko">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(cfg['title'])}</title>
<style>
{CSS.read_text()}
</style>

<div class="wrap">
  <header class="mast">
    <p class="eyebrow">웹툰 세로 스크롤 콘티 · 2590</p>
    <h1>피폭<em>{html.escape(cfg['sub'])}</em></h1>
    <p class="blurb">{html.escape(cfg['blurb'])}</p>

    <div class="stat">
      <div><b>{total}</b><span>컷</span></div>
      <div><b>{len(sections)}</b><span>파트</span></div>
      <div><b>{n3}</b><span>{l3}</span></div>
    </div>

    <div class="drain">{drain}</div>
    <div class="drain-cap">{drain_cap}</div>
    <p class="blurb">{cfg['drain_note']}</p>

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
{body}

  <footer>
{foot}
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
    out.write_text(page)
    print(f"→ {out.name}  ·  {len(sections)}파트  {total}컷")
    for k, t, n, p in counts:
        print(f"  {k:>2}  {t[:22]:<24} {n:>4}  {p}")
    return total


if __name__ == '__main__':
    targets = sys.argv[1:] or sorted(EPISODES)
    for ep in targets:
        if ep not in EPISODES:
            sys.exit(f"모르는 화: {ep}  (있는 것: {', '.join(sorted(EPISODES))})")
        build(ep)
