#!/usr/bin/env python3
"""ep01-gpt.md → 복사 버튼 달린 프롬프트 덱 페이지.

    python3 story/prompts/build-gpt-page.py

읽는 것: story/prompts/ep01-gpt.md
쓰는 것: story/prompts/ep01-gpt.html

`## 0-1 · 제목 〔P3〕` 다음에 오는 코드 블록만 프롬프트로 잡는다.
"""
import re, html, pathlib

HERE = pathlib.Path(__file__).resolve().parent
SRC  = HERE / 'ep01-gpt.md'
OUT  = HERE / 'ep01-gpt.html'

HEAD = re.compile(r'^## (\S+) · (.+?) 〔(.+?)〕\s*$')
GRP  = re.compile(r'^# (.+?)\s*$')

BATCH = """지금부터 내가 붙여넣는 각 블록을 하나씩 이미지로 만들어줘.
블록 하나당 이미지 한 장. 가로(landscape) 크기로.
설명이나 질문 없이 바로 생성만 해줘. 다음 블록을 붙이면 다음 장을 만들어줘."""

lines = SRC.read_text().split('\n')
cards, group, i = [], '', 0
while i < len(lines):
    g = GRP.match(lines[i])
    if g and not lines[i].startswith('##'):
        group = g.group(1)
        i += 1
        continue
    m = HEAD.match(lines[i])
    if m:
        j = i + 1
        while j < len(lines) and not lines[j].startswith('```') and j < i + 6:
            j += 1
        if j < len(lines) and lines[j].startswith('```'):
            k = j + 1
            buf = []
            while k < len(lines) and not lines[k].startswith('```'):
                buf.append(lines[k]); k += 1
            cards.append({'id': m.group(1), 'title': m.group(2), 'cut': m.group(3),
                          'group': group, 'body': '\n'.join(buf).strip()})
            i = k + 1
            continue
    i += 1

groups = []
for c in cards:
    if not groups or groups[-1]['name'] != c['group']:
        groups.append({'name': c['group'], 'cards': []})
    groups[-1]['cards'].append(c)

def esc(s):
    return html.escape(s)

sections = []
for gi, g in enumerate(groups):
    sections.append(f'<section class="grp"><h2>{esc(g["name"])}</h2>')
    for c in g['cards']:
        n = cards.index(c) + 1
        sections.append(f'''<article class="card" data-n="{n}">
  <header>
    <span class="cid">{esc(c["id"])}</span>
    <h3>{esc(c["title"])}</h3>
    <span class="cut">{esc(c["cut"])}</span>
  </header>
  <pre id="p{n}">{esc(c["body"])}</pre>
  <div class="row">
    <button class="copy" data-t="p{n}">프롬프트 복사</button>
    <label class="done"><input type="checkbox" data-n="{n}"> 뽑았음</label>
  </div>
</article>''')
    sections.append('</section>')

PAGE = f"""<title>피폭 프롬프트 덱</title>
<style>
:root{{
  --paper:#F1EDE4; --raise:#E7E1D4; --sunk:#EAE4D7; --ink:#191612;
  --dim:#6D6558; --faint:#9A9285; --rule:#D9D2C4; --hair:#E2DCCF;
  --accent:#8A6120; --ok:#4B6B4A;
  --serif:"Nanum Myeongjo","AppleMyungjo",Batang,"Times New Roman",serif;
  --sans:Pretendard,-apple-system,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif;
  --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
}}
@media (prefers-color-scheme:dark){{
  :root:not([data-theme="light"]){{
    --paper:#131110; --raise:#1B1815; --sunk:#0E0C0B; --ink:#E9E3D7;
    --dim:#8B8377; --faint:#635C51; --rule:#2B2721; --hair:#221F1A;
    --accent:#C79A54; --ok:#8FB08D;
  }}
}}
:root[data-theme="dark"]{{
  --paper:#131110; --raise:#1B1815; --sunk:#0E0C0B; --ink:#E9E3D7;
  --dim:#8B8377; --faint:#635C51; --rule:#2B2721; --hair:#221F1A;
  --accent:#C79A54; --ok:#8FB08D;
}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans);
  font-size:16px;line-height:1.7;-webkit-font-smoothing:antialiased}}
.wrap{{max-width:760px;margin:0 auto;padding:0 24px}}
.eyebrow{{font-family:var(--mono);font-size:11px;letter-spacing:.22em;text-transform:uppercase;
  color:var(--faint);margin:0 0 20px}}
.mast{{padding:80px 0 0}}
.mast h1{{font-family:var(--serif);font-weight:400;font-size:clamp(38px,9vw,60px);
  line-height:1.05;margin:0;text-wrap:balance}}
.mast h1 em{{font-style:normal;display:block;font-size:.4em;color:var(--dim);margin-top:16px}}
.lead{{margin:28px 0 0;color:var(--dim);font-size:15px;max-width:56ch}}

.howto{{margin:34px 0 0;border:1px solid var(--rule);border-radius:3px;padding:20px 22px;
  background:var(--raise)}}
.howto h2{{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--faint);margin:0 0 14px;font-weight:400}}
.howto ol{{margin:0;padding-left:20px;font-size:14.5px;color:var(--dim)}}
.howto li{{margin:0 0 7px}}
.howto b{{color:var(--ink)}}
.howto .batch{{margin:16px 0 0;display:flex;gap:10px;align-items:center;flex-wrap:wrap}}

table{{width:100%;border-collapse:collapse;margin:16px 0 0;font-size:14px}}
th,td{{text-align:left;padding:7px 10px;border-bottom:1px solid var(--hair);color:var(--dim)}}
th{{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--faint);font-weight:400}}
td b{{color:var(--ink)}}
.scroll{{overflow-x:auto}}

.bar{{position:sticky;top:0;z-index:9;background:var(--paper);border-bottom:1px solid var(--hair);
  margin-top:54px}}
.bar-in{{max-width:760px;margin:0 auto;padding:11px 24px;display:flex;gap:12px;align-items:center}}
.bar b{{font-family:var(--mono);font-size:11px;letter-spacing:.1em;color:var(--dim);font-weight:400;
  font-variant-numeric:tabular-nums;margin-right:auto}}
.meter{{flex:0 0 96px;height:4px;background:var(--hair);border-radius:2px;overflow:hidden}}
.meter i{{display:block;height:100%;width:0;background:var(--ok);transition:width .25s}}

button{{font-family:var(--mono);font-size:11px;letter-spacing:.06em;color:var(--dim);
  background:transparent;border:1px solid var(--rule);border-radius:2px;padding:7px 13px;
  cursor:pointer;transition:color .15s,border-color .15s,background .15s}}
button:hover{{color:var(--ink);border-color:var(--dim)}}
button:focus-visible{{outline:2px solid var(--accent);outline-offset:2px}}
button.hit{{color:var(--paper);background:var(--ok);border-color:var(--ok)}}

.grp{{margin:64px 0 0}}
.grp h2{{font-family:var(--serif);font-weight:400;font-size:26px;margin:0 0 6px;
  padding-bottom:10px;border-bottom:1px solid var(--accent)}}

.card{{margin:28px 0 0;border:1px solid var(--rule);border-radius:3px;overflow:hidden;
  background:var(--raise)}}
.card header{{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:baseline;
  padding:13px 16px;border-bottom:1px solid var(--hair)}}
.cid{{font-family:var(--mono);font-size:11px;letter-spacing:.08em;color:var(--accent)}}
.card h3{{font-family:var(--serif);font-weight:400;font-size:18px;margin:0}}
.cut{{font-family:var(--mono);font-size:10.5px;color:var(--faint);white-space:nowrap}}
pre{{margin:0;padding:16px;background:var(--sunk);font-family:var(--mono);font-size:12.5px;
  line-height:1.62;color:var(--ink);white-space:pre-wrap;word-break:break-word;
  max-height:230px;overflow-y:auto}}
.row{{display:flex;gap:14px;align-items:center;padding:12px 16px}}
.done{{font-family:var(--mono);font-size:11px;color:var(--faint);display:flex;gap:6px;
  align-items:center;cursor:pointer;user-select:none}}
.card.is-done{{opacity:.5}}
.card.is-done pre{{max-height:64px}}

footer{{padding:90px 0;border-top:1px solid var(--rule);margin-top:70px;color:var(--dim);font-size:14px}}
footer p{{max-width:52ch}}
@media (prefers-reduced-motion:reduce){{*{{transition:none!important}}}}
@media (max-width:560px){{
  .card header{{grid-template-columns:auto 1fr;row-gap:2px}}
  .cut{{grid-column:2}}
}}
</style>

<div class="wrap">
  <header class="mast">
    <p class="eyebrow">피폭 · 1화 · 이미지 생성</p>
    <h1>프롬프트 덱<em>IMAX 와이드 · {len(cards)}장</em></h1>
    <p class="lead">GPT에 그대로 붙여넣는 프롬프트 {len(cards)}장. 전부 자기 완결형이라
    앞뒤로 뭘 더 쓸 필요가 없다. 위에서부터 순서대로 뽑으면 1화가 다 나온다.</p>

    <div class="howto">
      <h2>쓰기 전에 30초</h2>
      <ol>
        <li>크기는 <b>가로(landscape) 1536 × 1024</b>로 고른다. 정사각·세로는 쓰지 않는다</li>
        <li>진짜 21:9는 안 나온다. 프롬프트마다 <b>2.39:1로 구성하라</b>고 넣어놨으니
            <b>받은 다음 위아래를 잘라내면</b> IMAX 비율이 된다</li>
        <li>새 대화를 하나 파고 아래 지시문을 <b>맨 먼저</b> 붙인다. 그다음부터 프롬프트만 계속 붙여넣는다</li>
      </ol>
      <div class="batch">
        <button class="copy" data-t="batch">연속 생성 지시문 복사</button>
        <span class="cut">한 번만 붙이면 된다</span>
      </div>
      <pre id="batch" hidden>{esc(BATCH)}</pre>

      <div class="scroll"><table>
        <tr><th>안 지켜지면</th><th>한 줄로 다시 말하기</th></tr>
        <tr><td><b>인물이 너무 큼</b></td><td>인물을 화면 높이의 10분의 1로 줄이고 더 멀리서.</td></tr>
        <tr><td><b>색이 예쁨</b></td><td>채도를 더 빼줘. 표백된 흙색만 남게.</td></tr>
        <tr><td><b>화면이 복잡함</b></td><td>요소를 절반으로 줄여줘. 빈 공간이 화면의 3분의 2.</td></tr>
        <tr><td><b>그림 같음</b></td><td>일러스트 말고 실사 사진. 65mm 필름 질감.</td></tr>
        <tr><td><b>얼굴이 보정됨</b></td><td>보정 없이. 모공과 검버섯이 보이게.</td></tr>
      </table></div>
    </div>
  </header>
</div>

<div class="bar">
  <div class="bar-in">
    <b id="prog">0 / {len(cards)} 뽑음</b>
    <div class="meter"><i id="fill"></i></div>
    <button id="reset">기록 지우기</button>
  </div>
</div>

<div class="wrap">
{chr(10).join(sections)}

  <footer>
    <p class="eyebrow">골라내는 기준</p>
    <p><b>제일 자주 틀리는 것 두 개:</b> 인물을 크게 잡는 것, 하늘을 예쁘게 만드는 것.
    그 둘만 잡으면 나머지는 대체로 맞게 나온다.</p>
    <p>통과 기준 — 사람이 배경에 먹히고, 색이 다 빠져 있고, 모공과 검버섯이 보이고,
    그림자가 짧고 딱딱하고, 화면의 3분의 2가 비어 있고, DX의 얼굴 자리가 그냥 판일 것.</p>
    <p>「뽑았음」 체크는 이 브라우저에만 저장된다. 다시 열어도 남아 있다.</p>
  </footer>
</div>

<script>
(function(){{
  var KEY='flmo-gpt-deck-v1';
  var state={{}};
  try{{ state=JSON.parse(localStorage.getItem(KEY)||'{{}}'); }}catch(e){{ state={{}}; }}
  var boxes=[].slice.call(document.querySelectorAll('.done input'));
  var prog=document.getElementById('prog'), fill=document.getElementById('fill');

  function save(){{ try{{ localStorage.setItem(KEY,JSON.stringify(state)); }}catch(e){{}} }}
  function paint(){{
    var n=0;
    boxes.forEach(function(b){{
      var on=!!state[b.dataset.n];
      b.checked=on;
      b.closest('.card').classList.toggle('is-done',on);
      if(on) n++;
    }});
    prog.textContent=n+' / '+boxes.length+' 뽑음';
    fill.style.width=(boxes.length? n/boxes.length*100 : 0)+'%';
  }}
  boxes.forEach(function(b){{
    b.addEventListener('change',function(){{
      if(b.checked) state[b.dataset.n]=1; else delete state[b.dataset.n];
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
      btn.textContent='복사됨';
      btn.classList.add('hit');
      setTimeout(function(){{ btn.textContent=label; btn.classList.remove('hit'); }},1400);
    }}
    if(navigator.clipboard && navigator.clipboard.writeText){{
      navigator.clipboard.writeText(text).then(ok,fallback);
    }} else {{ fallback(); }}
    function fallback(){{
      var ta=document.createElement('textarea');
      ta.value=text; ta.setAttribute('readonly','');
      ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.select();
      try{{ document.execCommand('copy'); ok(); }}catch(err){{}}
      document.body.removeChild(ta);
    }}
  }});
}})();
</script>
"""

OUT.write_text(PAGE)
print(f"→ {OUT.name}  ·  프롬프트 {len(cards)}장 / {len(groups)}묶음")
for g in groups:
    print(f"  {g['name'][:28]:<30} {len(g['cards'])}")
