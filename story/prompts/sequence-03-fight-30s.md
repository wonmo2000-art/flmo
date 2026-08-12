# 시퀀스 03 — 귀수 교전 30초 (Seedance 2.5)

> 2026-08-04. 시덴스 2.5는 **한 번에 30초**, 4K, 레퍼런스 50개까지 지원한다.

## 설정

| | |
|---|---|
| 길이 | **30초 · 한 번에 생성** |
| 화면비 | **4:3** — 2.5의 옵션은 16:9 / 9:16 / 1:1 / 4:3뿐. **1.43:1은 없다.** 4:3(1.33:1)이 아이맥스에 가장 가깝다 |
| 해상도 | 4K |
| 레퍼런스 | 다섯 명 라인업 + 귀수 이미지를 **슬롯에 직접 첨부.** `@태그`는 쓰지 않는다 |

> 지난 실패(포인트 미소모)의 원인 중 하나가 **1.43:1**이었을 가능성이 크다.
> 드롭다운에 없는 값이라 검증 단계에서 걸린다.

## 구조 — 다섯 비트

| 비트 | 내용 | 성격 |
|---|---|---|
| 1 | 머리가 내려오고 사슬이 늘어진다 | 가장 길게 홀드 |
| 2 | 사슬이 붉은 망토를 때린다. 땅이 갈라진다 | 충돌 |
| 3 | 마른 남자가 프레임을 가로지른다 | 가장 빠름 |
| 4 | 앞발이 내려온다. 땅이 튄다 | 붕괴 |
| 5 | 붉은 망토 혼자 사슬을 쥐고 남는다 | 다시 홀드 |

**정지 → 충돌 → 속도 → 붕괴 → 한 사람.**
카메라는 30초 내내 한 번도 안 움직인다. 높이만 비트마다 바뀐다.

추적 인물은 셋 — 붉은 망토(민머리), 마른 남자, 귀수. 나머지 둘은 배경으로 둔다.

---

## 통합 프롬프트 (한 덩어리)

```
A single 30-second photoreal cinematic shot in 4:3, five beats joined by hard
cuts, no dissolves. The camera is locked off on the cracked grey earth, dead
centre and square to everything, and never pans, tilts, zooms or moves at any
point across the whole 30 seconds — only its height changes between beats. Hard
overcast daylight from directly above at 6000K, no cast shadow, exposed 1.5
stops under, haze 35% rising to 60% after the ground strike. Cold desaturated
monochrome — grey earth, grey sky, black hide, black iron — broken only by one
deep red cloak, which stays fully saturated in every beat.

The setting is a vast plain of cracked grey earth in load-bearing plates. A
colossal horned beast stands 300 m out, 200 m tall at the shoulder, forelimbs
planted, two ribbed horns curving up past the top corners of frame, head hanging
120 m above the ground between them, its two pale eyes the only bright points in
the image. Heavy iron chains run from its neck out to both horizons, each link
the size of a person.

BEAT 1, held longest. Extreme wide, 84 degree field, camera at 1.6 m. Five
figures stand shoulder to shoulder facing camera on the vertical centre line,
each about 8% of frame height, the centre one bald and wearing the deep red
cloak. The beast's head descends 40 m toward them, continuous and unhurried. The
chains lose tension and the slack travels outward toward both horizons, sections
striking earth in sequence and lifting flat sheets of dust that hang in the air.
The five hold one posture — feet planted, hands open at their sides, chins
level, eyes forward. Their clothing moves in the wind; their bodies do not.
HARD CUT.

BEAT 2. Wide, 63 degree field, camera at 0.5 m. A chain as thick as a body whips
down and slams into the raised crossed forearms of the bald figure in the red
cloak. She absorbs it, drops into a deep crouch, and the earth fractures outward
beneath her boots in a spreading web of pressure cracks. She is already rising
as the dust reaches her waist. The other four are thrown two steps back and stay
on their feet. HARD CUT.

BEAT 3, fastest. Wide, 63 degree field, camera at 0.5 m. A gaunt figure with
white-streaked temples enters from frame right at 30 km/h, running low along the
fallen chain with steam trailing from two ports at his shoulder blades, crosses
the full width of frame as a near-blur and exits frame left. He does not return.
HARD CUT.

BEAT 4. Extreme wide, 84 degree field, camera at 1.6 m. One forefoot of the
beast comes down. The ground jumps — plates of earth lift and tilt, a wall of
dust rolls forward toward camera, the standing figures are knocked off their
line, and the chains leap once off the ground along their whole length and land
again. HARD CUT.

BEAT 5, held. Wide, 47 degree field, camera at 0.9 m. The dust thins. The bald
figure in the red cloak stands alone on the broken ground, both hands closed on
the chain, feet planted, dragged half a metre and holding. She looks up. The
beast's lowered head descends into the top of frame above her, its two pale eyes
coming down toward her, still descending when the shot ends.

Motion overlaps everywhere and nothing waits its turn: the chain is already
moving as BEAT 2 opens, the runner crosses while she is still rising behind him,
and the ground jump, rolling dust and leaping chains all land in the same
instant. No frozen poses; every body stays under load through every frame.
Performance is muscle-level only — forearms driving down into the impact, neck
locked, breath punched out through the teeth, jaw set, eyes open and level. No
shouting, no held grimaces.

Physical detail: chains carry enormous mass and strike with real force; earth
fractures as pressure cracking spreading edge to centre, never a clean break;
dust lifts in flat sheets that hang rather than billow; every figure has
grounded contact shadow at boot and knee; the beast's mass reads through the
depth its forefeet press into the ground and the slow inertia of its head.

Audio: chain links striking earth in travelling sequences, rock fracturing under
pressure, one set of running footfalls crossing fast and away, a single enormous
ground impact, hard breathing, and a deep sustained sub-bass pressure from the
creature that never resolves into a roar. No music, no dialogue.

Photographed, not illustrated — real cracked earth, real forged iron with rust
and pitting, real coarse cloth heavy with dust, real hide with deep furrows,
real skin with visible pores. No beauty retouching. Fine film grain, real-time
throughout with no slow motion.

Exactly five figures and exactly one creature across the whole 30 seconds. Same
faces in every beat. Exactly one red cloak and it stays the only saturated
colour in frame. Once the runner exits frame left he stays out. Chains hold
stable link size frame to frame. The creature's eyes stay two pale points and
nothing else on it emits light. Impact carried by strain, fracture, chain sound
and reaction. End mid-descent, unresolved, no settling shot. No text, no logo,
no watermark.
```

---

## 안 되면

30초 한 방은 뒤쪽 비트에서 흐트러질 위험이 있다.
그러면 **BEAT 1~5를 각각 6초짜리 개별 생성**으로 쪼개서 붙인다.
각 비트가 이미 독립적으로 쓰여 있어 그대로 잘라 쓸 수 있다.

## 미결

- [ ] 30초 한 방이 유지되는지, 아니면 비트별로 쪼개야 하는지
- [ ] 붉은 망토 = 여울인가 미르인가 (여기서는 이미지대로 민머리 = 미르)
- [ ] 화면비 4:3으로 전체 통일할 것인지 (1A~7A는 2.39:1)

---

# 10초 버전

> 10초에 다섯 비트는 안 들어간다. 비트당 2초면 아무것도 안 보인다.
> **셋으로 줄였다 — 충돌 → 앞발 → 한 사람.**
> 마른 남자가 가로지르는 비트는 뺐다. 아까우면 따로 10초로 뽑는다.

## 시간 배분

| 비트 | 길이 | |
|---|---|---|
| 1 충돌 | ~3초 | 사슬이 때리고 땅이 갈라짐 |
| 2 앞발 | ~2.5초 | **가장 큰 것.** 짧게 치고 지나감 |
| 3 홀드 | ~4.5초 | 혼자 남아 사슬을 쥠. 머리가 내려옴 |

> **가장 큰 사건에 가장 짧은 시간을 준다.**
> 앞발이 내려오는 건 2.5초면 충분하고,
> 그 뒤에 먼지가 걷히면서 한 사람만 남아 있는 4.5초가 실제로 무섭다.
> **스펙터클은 짧게, 그 결과는 길게.**

```
A single 10-second photoreal cinematic shot in 4:3, three beats joined by hard
cuts, no dissolves. The camera is locked off on cracked grey earth and never
pans, tilts, zooms or moves at any point — only its height changes between
beats. Hard overcast daylight from directly above at 6000K, no cast shadow,
exposed 1.5 stops under, haze 40% rising to 65% after the ground strike. Cold
desaturated monochrome — grey earth, grey sky, black hide, black iron — broken
only by one deep red cloak, which stays fully saturated in every beat.

The setting is a vast plain of cracked grey earth in load-bearing plates. A
colossal horned beast stands 300 m out, 200 m tall at the shoulder, two ribbed
horns curving up past the top corners of frame, its head lowered between them,
its two pale eyes the only bright points in the image. Heavy iron chains run
from its neck out to both horizons, each link the size of a person.

BEAT 1. Wide, 63 degree field, camera at 0.5 m. A chain as thick as a body whips
down and slams into the raised crossed forearms of a bald figure in a deep red
cloak. She absorbs it, drops into a deep crouch, and the earth fractures outward
beneath her boots in a spreading web of pressure cracks. She is already rising
as the dust reaches her waist. Four other figures behind her are thrown two
steps back and stay on their feet. HARD CUT.

BEAT 2, the largest. Extreme wide, 84 degree field, camera at 1.6 m. One forefoot
of the beast comes down. The ground jumps — plates of earth lift and tilt, a
wall of dust rolls forward toward camera and fills the lower half of frame, the
standing figures are knocked off their line, and the chains leap once off the
ground along their whole length and land again. HARD CUT.

BEAT 3, held longest. Wide, 47 degree field, camera at 0.9 m. The dust thins.
The bald figure in the red cloak stands alone on the broken ground, both hands
closed on the chain, feet planted, dragged half a metre and holding. She looks
up. The beast's lowered head descends into the top of frame above her, its two
pale eyes coming down toward her, and is still descending when the shot ends.

Motion overlaps and nothing waits its turn: the chain is already moving as the
shot opens, and the ground jump, the rolling dust and the leaping chains all
land in the same instant. No frozen poses; every body stays under load through
every frame. Performance is muscle-level only — forearms driving down into the
impact, neck locked, breath punched out through the teeth, jaw set, eyes open
and level on the descending head. No shouting, no held grimaces.

Physical detail: the chains carry enormous mass and strike with real force;
earth fractures as pressure cracking spreading edge to centre, never a clean
break; dust lifts in flat sheets that hang rather than billow; every figure has
grounded contact shadow at boot and knee; the beast's mass reads through the
depth its forefoot presses into the ground and the slow inertia of its head.

Audio: a chain striking flesh and armour, rock fracturing under pressure, one
enormous ground impact, hard breathing, and a deep sustained sub-bass pressure
from the creature that never resolves into a roar. No music, no dialogue.

Photographed, not illustrated — real cracked earth, real forged iron with rust
and pitting, real coarse cloth heavy with dust, real hide with deep furrows,
real skin with visible pores. No beauty retouching. Fine film grain, real-time
throughout with no slow motion.

Exactly five figures and exactly one creature. Same faces in every beat. Exactly
one red cloak and it stays the only saturated colour in frame. The chains hold
stable link size frame to frame. Scale anchor: the creature stands 200 m at the
shoulder and its lowered head alone is wider than all five figures standing side
by side. The creature's eyes stay two pale points and nothing else on it emits
light. Impact carried by strain, fracture, chain sound and reaction. End
mid-descent, unresolved, no settling shot. No text, no logo, no watermark.
```

## 세팅

**10초 · 4:3 · 4K.** 레퍼런스는 `@태그` 말고 슬롯에 직접 첨부.
