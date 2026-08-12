#!/usr/bin/env python3
"""ep01-seedance.md → 감독실 샷리스트 페이지 (복사 버튼 + 진행 체크).

    python3 story/prompts/build-seedance-page.py

읽는 것: story/prompts/ep01-seedance.md
쓰는 것: story/prompts/shotlist/ep01-seedance.html

구조 규칙
  `# S1 · 눈산`            → 씬 (체크박스 하나)
  `# 에셋 시트 프롬프트`     → 일반 묶음 (체크박스 없음)
  `## 1A · 제목 〔P3~P12〕`  → 프롬프트 카드 (바로 뒤 코드펜스가 본문)
  `# 프로젝트 바이블 …`      → 접히는 바이블 블록 (프롬프트에 안 들어감)
"""
import re, html, pathlib

HERE = pathlib.Path(__file__).resolve().parent
SRC  = HERE / 'ep01-seedance.md'
OUT  = HERE / 'shotlist' / 'ep01-seedance.html'

H1    = re.compile(r'^# (.+?)\s*$')
CARD  = re.compile(r'^## (\S+) · (.+?) 〔(.+?)〕\s*$')
SCENE = re.compile(r'^(S\d+) · (.+)$')


# ---------- 마크다운 부분집합 (바이블 전용) ----------
def inline(s):
    s = html.escape(s)
    s = re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
    s = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
    s = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<i>\1</i>', s)
    return s


def md(lines):
    out, i = [], 0
    while i < len(lines):
        l = lines[i]
        if l.startswith('```'):
            buf, i = [], i + 1
            while i < len(lines) and not lines[i].startswith('```'):
                buf.append(lines[i]); i += 1
            out.append('<pre class="plain">' + html.escape('\n'.join(buf)) + '</pre>')
            i += 1; continue
        if l.startswith('|'):
            rows = []
            while i < len(lines) and lines[i].startswith('|'):
                rows.append(lines[i]); i += 1
            cells = [[c.strip() for c in r.strip('|').split('|')] for r in rows]
            cells = [c for c in cells if not all(set(x) <= set('-: ') for x in c)]
            if cells:
                body = ''.join(
                    '<tr>' + ''.join(f'<td>{inline(c)}</td>' for c in row) + '</tr>'
                    for row in cells)
                out.append(f'<div class="scroll"><table>{body}</table></div>')
            continue
        if l.startswith('> '):
            buf = []
            while i < len(lines) and lines[i].startswith('> '):
                buf.append(lines[i][2:]); i += 1
            out.append('<blockquote>' + inline(' '.join(buf)) + '</blockquote>')
            continue
        if l.startswith('- '):
            buf = []
            while i < len(lines) and lines[i].startswith('- '):
                buf.append(f'<li>{inline(lines[i][2:])}</li>'); i += 1
            out.append('<ul>' + ''.join(buf) + '</ul>')
            continue
        m = re.match(r'^(#{2,4}) (.+)$', l)
        if m:
            lvl = min(len(m.group(1)) + 1, 5)
            out.append(f'<h{lvl}>{inline(m.group(2))}</h{lvl}>'); i += 1; continue
        if l.strip() in ('', '---'):
            i += 1; continue
        buf = []
        while i < len(lines) and lines[i].strip() and not re.match(
                r'^(#|\||>|- |```)', lines[i]):
            buf.append(lines[i]); i += 1
        if buf:
            out.append('<p>' + inline(' '.join(buf)) + '</p>')
    return '\n'.join(out)


# ---------- 파싱 ----------
lines = SRC.read_text().split('\n')
bible, groups, i = [], [], 0
while i < len(lines):
    m = H1.match(lines[i])
    if m and not lines[i].startswith('##'):
        title = m.group(1)
        if title.startswith('프로젝트 바이블'):
            i += 1
            while i < len(lines) and not (H1.match(lines[i])
                                          and not lines[i].startswith('##')):
                bible.append(lines[i]); i += 1
            continue
        sm = SCENE.match(title)
        groups.append({'key': sm.group(1) if sm else '',
                       'name': sm.group(2) if sm else title,
                       'scene': bool(sm), 'cards': []})
        i += 1
        continue
    c = CARD.match(lines[i])
    if c and groups:
        j = i + 1
        while j < len(lines) and not lines[j].startswith('```') and j < i + 6:
            j += 1
        if j < len(lines) and lines[j].startswith('```'):
            k, buf = j + 1, []
            while k < len(lines) and not lines[k].startswith('```'):
                buf.append(lines[k]); k += 1
            groups[-1]['cards'].append({'id': c.group(1), 'title': c.group(2),
                                        'cut': c.group(3),
                                        'body': '\n'.join(buf).strip()})
            i = k + 1
            continue
    i += 1

groups = [g for g in groups if g['cards']]
total = sum(len(g['cards']) for g in groups)
scenes = [g for g in groups if g['scene']]

blocks, n = [], 0
for g in groups:
    head = (f'<span class="gk">{html.escape(g["key"])}</span>' if g['key'] else '')
    chk = (f'<label class="tick"><input type="checkbox" data-s="{html.escape(g["key"])}">'
           f'<span>찍음</span></label>' if g['scene'] else '')
    blocks.append(f'<section class="grp" data-scene="{1 if g["scene"] else 0}">'
                  f'<header class="ghead">{head}<h2>{html.escape(g["name"])}</h2>{chk}</header>')
    for c in g['cards']:
        n += 1
        blocks.append(f'''<article class="card">
  <header>
    <span class="cid">{html.escape(c["id"])}</span>
    <h3>{html.escape(c["title"])}</h3>
    <span class="cut">{html.escape(c["cut"])}</span>
  </header>
  <pre id="p{n}">{html.escape(c["body"])}</pre>
  <div class="row"><button class="copy" data-t="p{n}">프롬프트 복사</button>
  <span class="hint">10초 · 21:9 · 4K · 오디오 ON</span></div>
</article>''')
    blocks.append('</section>')

PAGE = f"""<title>피폭 샷리스트</title>
<style>
:root{{
  --bg:#0E0D0C; --panel:#161412; --sunk:#0A0908; --line:#262220; --hair:#1C1917;
  --ink:#E8E2D6; --dim:#9A9084; --faint:#6A6155;
  --ochre:#C79A54; --night:#8E8ACB; --ok:#7FA97C;
  --serif:"Nanum Myeongjo","AppleMyungjo",Batang,"Times New Roman",serif;
  --sans:Pretendard,-apple-system,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  color-scheme:dark;
}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);
  font-size:16px;line-height:1.7;-webkit-font-smoothing:antialiased}}
.wrap{{max-width:820px;margin:0 auto;padding:0 24px}}
a{{color:var(--ochre)}}
.eyebrow{{font-family:var(--mono);font-size:11px;letter-spacing:.22em;text-transform:uppercase;
  color:var(--faint);margin:0 0 20px}}

.mast{{padding:78px 0 0}}
.mast h1{{font-family:var(--serif);font-weight:400;font-size:clamp(38px,9vw,62px);
  line-height:1.04;margin:0;text-wrap:balance}}
.mast h1 em{{font-style:normal;display:block;font-size:.38em;color:var(--dim);margin-top:16px}}
.lead{{margin:26px 0 0;color:var(--dim);font-size:15px;max-width:58ch}}
.spec{{display:flex;gap:26px;margin:32px 0 0;padding:18px 0;
  border-top:1px solid var(--line);border-bottom:1px solid var(--line);flex-wrap:wrap}}
.spec div{{display:flex;flex-direction:column;gap:2px}}
.spec b{{font-family:var(--mono);font-size:18px;font-weight:500;font-variant-numeric:tabular-nums}}
.spec span{{font-family:var(--mono);font-size:10px;letter-spacing:.15em;text-transform:uppercase;
  color:var(--faint)}}

details.bible{{margin:34px 0 0;border:1px solid var(--line);border-radius:3px;background:var(--panel)}}
details.bible>summary{{cursor:pointer;padding:16px 20px;font-family:var(--mono);font-size:11px;
  letter-spacing:.18em;text-transform:uppercase;color:var(--ochre);list-style:none}}
details.bible>summary::-webkit-details-marker{{display:none}}
details.bible>summary::before{{content:"▸ ";color:var(--faint)}}
details.bible[open]>summary::before{{content:"▾ "}}
.bible-in{{padding:0 20px 22px;border-top:1px solid var(--hair);font-size:14.5px;color:var(--dim)}}
.bible-in h3{{font-family:var(--serif);font-weight:400;font-size:20px;color:var(--ink);
  margin:26px 0 8px}}
.bible-in h4{{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--faint);margin:20px 0 6px;font-weight:400}}
.bible-in b{{color:var(--ink)}}
.bible-in blockquote{{margin:12px 0;padding:10px 14px;border-left:2px solid var(--ochre);
  background:var(--sunk);border-radius:0 2px 2px 0}}
.bible-in ul{{padding-left:20px}}
.bible-in code{{font-family:var(--mono);font-size:12.5px;color:var(--ochre)}}
pre.plain{{margin:12px 0;padding:14px;background:var(--sunk);border:1px solid var(--hair);
  border-radius:2px;font-family:var(--mono);font-size:12px;line-height:1.6;color:var(--ink);
  white-space:pre-wrap;word-break:break-word}}
table{{width:100%;border-collapse:collapse;margin:12px 0;font-size:13.5px}}
td{{text-align:left;padding:7px 10px;border-bottom:1px solid var(--hair);vertical-align:top}}
.scroll{{overflow-x:auto}}

.bar{{position:sticky;top:0;z-index:9;background:var(--bg);border-bottom:1px solid var(--line);
  margin-top:50px}}
.bar-in{{max-width:820px;margin:0 auto;padding:11px 24px;display:flex;gap:12px;align-items:center}}
.bar b{{font-family:var(--mono);font-size:11px;letter-spacing:.1em;color:var(--dim);
  font-weight:400;font-variant-numeric:tabular-nums;margin-right:auto}}
.meter{{flex:0 0 96px;height:4px;background:var(--line);border-radius:2px;overflow:hidden}}
.meter i{{display:block;height:100%;width:0;background:var(--ok);transition:width .25s}}

button{{font-family:var(--mono);font-size:11px;letter-spacing:.06em;color:var(--dim);
  background:transparent;border:1px solid var(--line);border-radius:2px;padding:7px 13px;
  cursor:pointer;transition:color .15s,border-color .15s,background .15s}}
button:hover{{color:var(--ink);border-color:var(--dim)}}
button:focus-visible{{outline:2px solid var(--ochre);outline-offset:2px}}
button.hit{{color:var(--bg);background:var(--ok);border-color:var(--ok)}}

.grp{{margin:60px 0 0}}
.ghead{{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:baseline;
  padding-bottom:10px;border-bottom:1px solid var(--ochre)}}
.gk{{font-family:var(--mono);font-size:12px;letter-spacing:.14em;color:var(--ochre)}}
.ghead h2{{font-family:var(--serif);font-weight:400;font-size:25px;margin:0}}
.tick{{font-family:var(--mono);font-size:11px;color:var(--faint);display:flex;gap:6px;
  align-items:center;cursor:pointer;user-select:none}}
.grp.is-done{{opacity:.45}}
.grp.is-done .card pre{{max-height:60px}}

.card{{margin:24px 0 0;border:1px solid var(--line);border-radius:3px;overflow:hidden;
  background:var(--panel)}}
.card header{{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:baseline;
  padding:13px 16px;border-bottom:1px solid var(--hair)}}
.cid{{font-family:var(--mono);font-size:11px;letter-spacing:.08em;color:var(--night)}}
.card h3{{font-family:var(--serif);font-weight:400;font-size:18px;margin:0}}
.cut{{font-family:var(--mono);font-size:10.5px;color:var(--faint);white-space:nowrap}}
.card pre{{margin:0;padding:16px;background:var(--sunk);font-family:var(--mono);font-size:12px;
  line-height:1.62;color:var(--ink);white-space:pre-wrap;word-break:break-word;
  max-height:300px;overflow-y:auto}}
.row{{display:flex;gap:14px;align-items:center;padding:12px 16px}}
.hint{{font-family:var(--mono);font-size:10.5px;color:var(--faint)}}

footer{{padding:80px 0;border-top:1px solid var(--line);margin-top:70px;color:var(--dim);
  font-size:14px}}
footer p{{max-width:54ch}}
@media (prefers-reduced-motion:reduce){{*{{transition:none!important}}}}
@media (max-width:560px){{
  .card header,.ghead{{grid-template-columns:auto 1fr;row-gap:2px}}
  .cut,.tick{{grid-column:2}}
}}
</style>

<div class="wrap">
  <header class="mast">
    <p class="eyebrow">Seedance 2.0 · 1화 새동네</p>
    <h1>샷리스트<em>10초 생성 {total}개</em></h1>
    <p class="lead">프롬프트 하나 = 생성 하나. 전부 자기 완결형이라 앞뒤 맥락 없이
    단독으로 붙여 넣는다. 씬을 다 찍으면 「찍음」을 체크한다 — 이 브라우저에 저장된다.</p>

    <div class="spec">
      <div><b>{total}</b><span>프롬프트</span></div>
      <div><b>{len(scenes)}</b><span>씬</span></div>
      <div><b>10s</b><span>길이</span></div>
      <div><b>21:9</b><span>화면비</span></div>
      <div><b>4K</b><span>해상도</span></div>
    </div>

    <details class="bible">
      <summary>프로젝트 바이블 — 프롬프트에 복사하지 않는다</summary>
      <div class="bible-in">{md(bible)}</div>
    </details>
  </header>
</div>

<div class="bar">
  <div class="bar-in">
    <b id="prog">0 / {len(scenes)} 씬</b>
    <div class="meter"><i id="fill"></i></div>
    <button id="reset">기록 지우기</button>
  </div>
</div>

<div class="wrap">
{chr(10).join(blocks)}

  <footer>
    <p class="eyebrow">촬영 순서</p>
    <p>S4~S5(DX-11 도착 → 4초)를 먼저 뽑는다. 여기가 제일 어렵고, 여기가 되면 나머지는 다 된다.
    그다음 S1(프롤로그) → S8~S10(벽 · 밤 · 낙하) → 나머지.</p>
    <p>한 프롬프트당 2~4회 생성하고 고른다. 부분만 맞으면 전체 재생성보다 Extend/Edit이 낫다.
    얼굴이 흔들리면 프롬프트가 아니라 캐릭터 시트를 고친다.</p>
    <p>노인 넷에게는 금속이 한 조각도 없다. 그게 이 작품의 그림이다.</p>
  </footer>
</div>

<script>
(function(){{
  var KEY='flmo-seedance-ep01-v1', state={{}};
  try{{ state=JSON.parse(localStorage.getItem(KEY)||'{{}}'); }}catch(e){{ state={{}}; }}
  var boxes=[].slice.call(document.querySelectorAll('.tick input'));
  var prog=document.getElementById('prog'), fill=document.getElementById('fill');
  function save(){{ try{{ localStorage.setItem(KEY,JSON.stringify(state)); }}catch(e){{}} }}
  function paint(){{
    var n=0;
    boxes.forEach(function(b){{
      var on=!!state[b.dataset.s];
      b.checked=on;
      b.closest('.grp').classList.toggle('is-done',on);
      if(on) n++;
    }});
    prog.textContent=n+' / '+boxes.length+' 씬';
    fill.style.width=(boxes.length? n/boxes.length*100 : 0)+'%';
  }}
  boxes.forEach(function(b){{
    b.addEventListener('change',function(){{
      if(b.checked) state[b.dataset.s]=1; else delete state[b.dataset.s];
      save(); paint();
    }});
  }});
  document.getElementById('reset').addEventListener('click',function(){{
    state={{}}; save(); paint();
  }});
  paint();

  document.addEventListener('click',function(e){{
    var btn=e.target.closest('button.copy');
    if(!btn) return;
    var el=document.getElementById(btn.dataset.t);
    if(!el) return;
    var text=el.textContent, label=btn.textContent;
    function ok(){{
      btn.textContent='복사됨'; btn.classList.add('hit');
      setTimeout(function(){{ btn.textContent=label; btn.classList.remove('hit'); }},1400);
    }}
    function fallback(){{
      var ta=document.createElement('textarea');
      ta.value=text; ta.setAttribute('readonly','');
      ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.select();
      try{{ document.execCommand('copy'); ok(); }}catch(err){{}}
      document.body.removeChild(ta);
    }}
    if(navigator.clipboard && navigator.clipboard.writeText){{
      navigator.clipboard.writeText(text).then(ok,fallback);
    }} else {{ fallback(); }}
  }});
}})();
</script>
"""

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(PAGE)
print(f"→ {OUT.relative_to(HERE.parent.parent)}  ·  프롬프트 {total}개 / 씬 {len(scenes)}개")
for g in groups:
    tag = g['key'] or '—'
    print(f"  {tag:>3}  {g['name'][:24]:<26} {len(g['cards'])}")
