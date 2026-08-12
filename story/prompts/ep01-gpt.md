# 1화 이미지 프롬프트 — GPT용 (IMAX 와이드)

> **GPT(ChatGPT 이미지)에 그대로 복사해서 붙이는 용도.**
> 아래 프롬프트는 **전부 자기 완결형**이다. 앞뒤로 뭘 더 붙일 필요 없다.
> 한 블록 = 이미지 한 장. 위에서부터 순서대로 뽑으면 1화가 다 나온다.

---

## 쓰기 전에 30초만

### 1. 크기는 **가로(landscape)** 로 고른다

GPT 이미지가 실제로 내주는 크기는 셋뿐이다.

| | | |
|---|---|---|
| **1536 × 1024** | 가로 3:2 | **← 이걸 쓴다** |
| 1024 × 1024 | 정사각 | 쓰지 않는다 |
| 1024 × 1536 | 세로 | 쓰지 않는다 |

**진짜 21:9는 안 나온다.** 그래서 프롬프트마다 *"2.39:1 와이드로 구성하고
위아래에 여유를 남겨라"* 를 넣어놨다. **받은 다음 위아래를 잘라내면 IMAX 비율이 된다.**

> 잘라낼 걸 감안해서 인물을 화면 한가운데 띠 안에 두게 써놨다. 그냥 잘라도 안 잘린다.

### 2. 여러 장 한 번에 뽑기

GPT는 한 번에 한 장씩 낸다. 빠르게 돌리는 방법은 이거다.

1. 새 대화를 하나 판다
2. 아래 **「연속 생성 지시문」** 을 맨 먼저 붙인다
3. 그다음부터 프롬프트 블록만 계속 붙여넣는다. 스타일 설명을 매번 안 해도 된다

```
지금부터 내가 붙여넣는 각 블록을 하나씩 이미지로 만들어줘.
블록 하나당 이미지 한 장. 가로(landscape) 크기로.
설명이나 질문 없이 바로 생성만 해줘. 다음 블록을 붙이면 다음 장을 만들어줘.
```

### 3. 안 지켜지는 게 있으면

GPT는 문장이 길어지면 뒤쪽을 흘린다. 그럴 땐 **한 줄만 다시 말한다.**

| 증상 | 한 줄로 다시 말하기 |
|---|---|
| 인물이 너무 크게 나옴 | *"인물을 화면 높이의 10분의 1로 줄이고 더 멀리서."* |
| 색이 예쁘게 나옴 | *"채도를 더 빼줘. 표백된 흙색만 남게."* |
| 화면이 복잡함 | *"요소를 절반으로 줄여줘. 빈 공간이 화면의 3분의 2."* |
| 그림처럼 나옴 | *"일러스트 말고 실사 사진. 65mm 필름 질감."* |
| 얼굴이 예쁘게 보정됨 | *"보정 없이. 모공과 검버섯이 보이게."* |

---

# 0. 눈 — 프롤로그

> 여기만 흰색이다. **눈은 깨끗한 게 아니라 비어 있다.** 예쁘게 나오면 실패다.

## 0-1 · 눈산을 오르는 둘 〔P3〕

```
Extreme wide cinematic still, composed for a 2.39:1 IMAX crop with empty space
left above and below. A vast unbroken snow slope fills the frame, rising to a
ridge in the upper third; dark wet rock breaks through the snow along the left.
Low cloud sits on the ridge and erases the summit entirely. Wind lifts loose
snow off the surface in long horizontal streams.

Near the centre, two very small figures climb the slope in profile — a tall
adult and a much smaller child beside them, holding hands. Heavy layered
fur-and-hide coats crusted pale with ice, hoods down, dark hair pulled back.
The figures are no more than one tenth of the frame height. A single line of
footprints runs back behind them and fades into blown snow.

Photoreal 65mm film still, not illustration. Flat diffused light through heavy
overcast at 7500K, no visible sun, no warm tone anywhere. Blown-out whites and
soft grey shadow only. Blowing snow haze at 30%. Minimal composition, the
mountain is the subject and the people are scale. Fine grain, ultra high detail.
No text, no logo, no watermark.
```

## 0-2 · 잡은 손 〔P5〕

```
Extreme close cinematic still, composed for a 2.39:1 IMAX crop. An adult's bare
hand holding a child's much smaller bare hand, gripped hard, seen from the side
against a completely white out-of-focus background of snow. Both hands are
wind-chapped and cracked, knuckles red, dry skin splitting. Frost on the cuffs
of two different coarse hide sleeves. The grip is the only thing in the frame.

Photoreal 65mm film still, not illustration. Flat diffused overcast light at
7500K, no sun, no warm tone. Almost the entire image is white. Real skin
texture, visible pores, no retouching. Shallow depth of field. Minimal
composition. Fine grain, ultra high detail. No text, no logo, no watermark.
```

## 0-3 · 벽 아래 줄 〔P41〕

```
Extreme wide cinematic still, composed for a 2.39:1 IMAX crop with empty space
above and below. A queue of people stretches from the foreground to the
horizon across cracked dry ground, running parallel to an enormous smooth white
wall that fills the right half of the frame and continues past the edge. The
wall has no door, no window, no seam — 60 metres tall, blank.

Every pair in the queue is one adult and one child, standing close, luggage
minimal. They wear layered wrapped cloth, dust scarves, mismatched salvaged
metal plates. Nobody is talking. Dust hangs in the air.

Photoreal 65mm film still, not illustration. Flat overcast midday light at
5600K from overhead, short hard shadows, exposed one stop under. Bleached
palette — dry ochre earth, faded cloth, oxidised steel, pale grey sky. The wall
is the only clean bright thing in the frame. Real skin texture, no retouching.
Minimal composition, two thirds empty. Fine grain, ultra high detail. No text,
no logo, no watermark.
```

---

# A~C. 새동네 — 표백된 정오

> **밝은데 죽어 있다.** 따뜻한 오후 햇빛은 쓰지 않는다.

## A-1 · 조준경 속 마을 〔A4〕

```
Wide cinematic still seen through a rifle scope, composed for a 2.39:1 IMAX
crop. A black circular vignette frames the image, with thin etched crosshairs
slightly off centre. Inside the circle, seen at long range through heat shimmer
and dust: six or seven low mud-brick houses huddled together on flat cracked
ground, faded laundry on a line, a few chickens. The horizon behind them is
completely empty except for scattered burnt tree trunks.

The optics are old — slight edge distortion, dust on the glass, a faint scratch.

Photoreal 65mm film still, not illustration. Flat overcast midday at 5600K,
short hard shadows, exposed one stop under. Heavy airborne dust haze at 40%
softening the village. Bleached palette, nothing saturated. Minimal composition.
Fine grain, ultra high detail. No text, no logo, no watermark.
```

## A-2 · 단이 〔A23〕

```
Medium-wide character still, composed for a 2.39:1 IMAX crop, subject at the
left third with empty dusty plain filling the rest. A 22-year-old with a shaved-
short head and dried mud on the face, standing in flat open desert, lowering an
old bolt-action rifle. A dust scarf at the throat, forearms wrapped in strips
of cloth, and one mismatched black-lacquered armour plate strapped to a single
shoulder — clearly taken from someone else and the wrong size. Everything else
is layered undyed wrapped cloth, sun-bleached and patched.

Tired, flat expression. Not heroic, not posed.

Photoreal 65mm film still, not illustration. Flat overcast midday at 5600K from
overhead, short hard shadows, exposed one stop under. Airborne dust haze.
Bleached palette — dry ochre, faded cloth, oxidised steel, pale grey sky. Real
skin texture with pores, sunburn and dust in the creases, no retouching.
Minimal composition. Fine grain, ultra high detail. No text, no logo, no
watermark.
```

## A-3 · 가면 아홉 〔A26〕

```
Wide cinematic still, composed for a 2.39:1 IMAX crop. Nine figures stand in a
loose line on a bare dust ridge, backlit by a flat white sky, all facing
forward. Each is wrapped head to foot in layered pale cloth so no skin shows,
and each wears a smooth featureless white mask with no eyes and no mouth.

At their feet, held on rope leads, sit several large gaunt animals — long-limbed
dogs or wolves — and the animals are wearing smooth white masks too, fitted over
their muzzles. The animals are patchy and scarred but held with dignity, not
grotesque.

Nobody is moving. Dust drifts across the line.

Photoreal 65mm film still, not illustration. Flat overcast midday at 5600K,
short hard shadows, exposed one stop under. Airborne dust haze at 30%. Bleached
palette, the masks are the brightest value. Minimal composition, wide empty sky
above. Fine grain, ultra high detail. No text, no logo, no watermark.
```

## B-1 · 새동네 전경 〔B21〕

```
Extreme wide cinematic still, composed for a 2.39:1 IMAX crop with empty space
above and below. A tiny settlement of six or seven low mud-brick houses sits on
a vast flat plain of cracked dry earth and loose gravel, seen from slightly
above and far away. Rusted corrugated tin roofs, faded washing on a line, a
wooden platform bed in the open yard, a hand-dug well. Scattered burnt tree
trunks stand at intervals across the empty land behind, all the way to the
horizon.

There is nothing else in any direction. No road, no fence, no other building.

Photoreal 65mm film still, not illustration. Flat overcast midday at 5600K from
overhead, short hard shadows, exposed one stop under. Airborne dust haze at 30%
erasing the far horizon. Bleached palette — dry ochre, oxidised rust, pale grey
sky, nothing saturated. Minimal composition, the village occupies less than a
fifth of the frame. Fine grain, ultra high detail. No text, no logo, no
watermark.
```

## C-1 · 평상의 노인 넷 〔A7 · C29〕

```
Wide cinematic still, composed for a 2.39:1 IMAX crop. Four very old people sit
side by side on a low wooden platform bed in a bare dirt yard, shelling beans
into a shared shallow bowl. They are past a hundred and look it — bent backs,
thick-knuckled spotted hands, white hair tied back. They wear only layered
undyed cloth wrapped and belted, no armour, no ornament, everything faded to
the same colour as the ground.

One lies half-propped with a worn wooden cane across the lap. One sits
absolutely straight with eyes closed, the irises clouded white. Nobody is
looking at anybody. A tin bucket, a water jar, a few chickens nearby.

Photoreal 65mm film still, not illustration. Flat overcast midday at 5600K from
overhead, short hard shadows, exposed one stop under. Airborne dust haze.
Bleached palette. Real aged skin texture with deep creases, sun damage and age
spots, absolutely no retouching. Minimal composition, plenty of empty yard.
Fine grain, ultra high detail. No text, no logo, no watermark.
```

---

# D~E. DX-11과 4초

## D-1 · DX-11 일곱이 온다 〔D18〕

```
Wide cinematic still, composed for a 2.39:1 IMAX crop. Seven identical humanoid
combat machines walk in formation along a dirt track toward the camera, kicking
up dust. Matte black-lacquered segmented plate armour, thick with dust, with
exposed polished silver ball joints at knee, elbow, shoulder and neck. Each
carries an upright spear.

They have no face — where a face would be there is a single blank grey plate,
no eyes, no mouth, no sensor. Every one of them is in exactly the same phase of
the same stride: identical step length, identical arm swing, identical angle.
That uniformity is the point.

Photoreal 65mm film still, not illustration. Flat overcast midday at 5600K,
short hard shadows, exposed one stop under. Heavy dust kicked up at ankle
height. Bleached palette — the black armour is the darkest value in an
otherwise pale frame. Minimal composition, empty plain behind. Fine grain,
ultra high detail. No text, no logo, no watermark.
```

## D-2 · 집행자 대장 〔D20〕

```
Medium cinematic still, composed for a 2.39:1 IMAX crop. A human man in his
mid-thirties stands alone in a bare dirt yard holding a thin metal writing
tablet, looking down at it. He wears the same black-lacquered plate as the
machines behind him but his is scuffed, repaired and clearly worn in — and
unlike them he has a face: a long old scar across the throat, chapped lips,
dust in the stubble, visibly breathing.

Out of focus behind him, two faceless machines stand motionless in identical
posture.

Photoreal 65mm film still, not illustration. Flat overcast midday at 5600K,
short hard shadows, exposed one stop under. Airborne dust haze. Bleached
palette. Real skin texture with pores, sweat and dust, no retouching. Shallow
depth of field, minimal composition. Fine grain, ultra high detail. No text, no
logo, no watermark.
```

## E-1 · 접힌다 〔E2〕

```
Wide cinematic action still, composed for a 2.39:1 IMAX crop. The aftermath
instant: a faceless black-armoured humanoid machine is in mid-air, folded
backwards at the waist far past what a body could survive, flying across a bare
dirt yard toward a mud-brick wall. Dust and grit explode outward beneath it.
One silver-jointed arm has already separated and tumbles separately.

In the lower left foreground, small and completely still, a very old woman
remains seated on a low wooden platform bed. She has not stood up. Her arm is
extended and the tip of a worn wooden cane is still where the machine's chest
used to be. Her expression is bored.

Photoreal 65mm film still, not illustration. Flat overcast midday at 5600K,
short hard shadows. Motion is read through debris and posture, not through blur
streaks. Bleached palette. Minimal composition. Fine grain, ultra high detail.
No text, no logo, no watermark.
```

## E-2 · 우물에 뜬 기름 〔E47〕

```
Close overhead cinematic still, composed for a 2.39:1 IMAX crop. Looking
straight down into a rough hand-dug stone well. Dark water at the bottom, and
floating on the surface a spreading iridescent film of grey machine oil,
breaking the reflection of the pale sky. A black armoured limb is just visible
under the surface, sinking. No blood anywhere.

Photoreal 65mm film still, not illustration. Flat overcast midday at 5600K from
overhead. Bleached palette; the oil film is the only place any colour appears,
and even that is dulled. Minimal composition, the stone rim framing a circle of
dark water. Fine grain, ultra high detail. No text, no logo, no watermark.
```

## E-3 · 4초 뒤 마당 〔E49〕

```
Wide cinematic still, composed for a 2.39:1 IMAX crop. A bare dirt yard, dust
still hanging in the air. Seven faceless black-armoured machines lie scattered
across it in impossible shapes — one folded backwards into a body-shaped hole
in a mud wall, two standing upright with both knees bent the wrong way, one
with its spear tied into a neat knot, three soaking at the lip of a well. Grey
oil, no blood.

On a low wooden platform bed in the middle of it, four very old people sit
shelling beans, none of them looking at the wreckage. A bowl between them.
Chickens are already walking back in.

Photoreal 65mm film still, not illustration. Flat overcast midday at 5600K,
short hard shadows, exposed one stop under. Airborne dust. Bleached palette.
Minimal composition. Fine grain, ultra high detail. No text, no logo, no
watermark.
```

---

# F. 90년 전 — 벽 안의 회색

> 여기는 **어두운데 깨끗하다.** 그림자가 거의 없다.

## F-1 · 복도의 잔상 〔F17〕

```
Wide cinematic still, composed for a 2.39:1 IMAX crop. A long windowless grey
concrete corridor with a low ceiling, lit by flat shadowless panels overhead.
Completely empty and clean.

A twelve-year-old child in a plain grey garment that is open down the back is
caught mid-motion halfway up one wall, one bare foot planted on the concrete,
body horizontal, hair flung out. Behind them the air holds two or three faint
overlapping afterimages of the same child at earlier points along the corridor,
thin and almost transparent.

The child is laughing — an open, delighted, uncontrolled laugh. On the back of
the neck, a small freshly branded number.

Photoreal 65mm film still, not illustration. Cool flat interior light at 4000K,
no visible shadow, low contrast, grey on grey. Desaturated to almost nothing.
Real child skin texture, no retouching. Minimal composition, long empty
corridor. Fine grain, ultra high detail. No text, no logo, no watermark.
```

## F-2 · 바닥이 열린다 〔F29〕

```
Extreme vertical-feeling cinematic still, composed for a 2.39:1 IMAX crop
looking almost straight down. A grey concrete floor has split open into a wide
rectangular hatch. Below the opening there is no lower deck and no ground —
only open sky, then a layer of cloud, and far below that a brown desert plain
so distant it has almost no detail.

At the edge of the opening, seen from behind and above, a small barefoot child
in a grey open-backed garment stands looking down. An adult's gloved hand is
just entering frame at the child's back.

Photoreal 65mm film still, not illustration. Cool flat interior light at 4000K
on the metal, brilliant hazy daylight rising from the opening. Extreme sense of
altitude. Desaturated. Minimal composition, most of the frame is the drop. Fine
grain, ultra high detail. No text, no logo, no watermark.
```

---

# H~K. 화물차 · 흰 벽 · 여울

## H-1 · 화물차 짐칸 〔J1〕

```
Wide cinematic still, composed for a 2.39:1 IMAX crop. The open cargo bed of an
old flatbed truck seen from inside, packed with about thirty children aged
twelve to fifteen sitting on benches along both sides, knees together. All of
them wear identical brand-new plain clothing that does not fit yet and looks
wrong on them — too clean against their sunburnt hands and faces.

Some are excited and talking. One boy jitters his leg. One girl by the tailgate
sits very straight and looks out at the passing desert without expression.
Dust streams past the open back.

Photoreal 65mm film still, not illustration. Flat overcast midday at 5600K
spilling in from the open tailgate, interior a stop darker. Airborne dust.
Bleached palette. Real skin texture, no retouching, no beautified faces.
Minimal composition. Fine grain, ultra high detail. No text, no logo, no
watermark.
```

## H-2 · 흰 벽 〔J36〕 — **이 화의 최대 컷**

```
Extreme wide cinematic still, composed for a 2.39:1 IMAX crop, the single
widest shot in the film. An enormous smooth white wall runs across the entire
frame from edge to edge, crossing an empty desert. It is 60 metres tall, with
no door, no window, no gate, no seam and no marking of any kind. It simply
continues past both sides of the frame.

At its base, tiny, three flatbed trucks are parked and a small crowd of
children stands looking up. They are almost too small to make out.

Everything else in the frame — sand, sky, distant burnt trunks — is dulled by
dust. The wall is the only clean bright thing anywhere, and it is unnaturally
clean.

Photoreal 65mm film still, not illustration. Flat overcast midday at 5600K,
short hard shadows, exposed one stop under. Heavy airborne dust haze. Bleached
palette. Minimal composition, extreme scale contrast, people under one
fiftieth of frame height. Fine grain, ultra high detail. No text, no logo, no
watermark.
```

## H-3 · 크레인 승강대 〔J43〕

```
Wide low-angle cinematic still, composed for a 2.39:1 IMAX crop, looking steeply
up. From the top of an enormous blank white wall, a heavy industrial crane arm
has swung out over the edge. A rusted open steel platform hangs from cables and
descends toward the sand, still high above the ground.

About twenty children stand waiting below in the wall's shadow, faces tilted up,
brand-new clothes, small bundles. One is smiling. The scale between the platform
and the wall above it is absurd.

Photoreal 65mm film still, not illustration. Flat overcast midday at 5600K,
pale grey sky, the white wall blown slightly hot. Airborne dust. Bleached
palette against clean white. Minimal composition. Fine grain, ultra high detail.
No text, no logo, no watermark.
```

## K-1 · 여울 〔K4〕

```
Wide cinematic still, composed for a 2.39:1 IMAX crop. A long windowless grey
concrete corridor lit by flat shadowless overhead panels. In the middle
distance, a woman who appears to be about twenty kneels on the floor wringing a
cloth into a metal bucket, in worn grey work coveralls with no insignia, no
number, no badge of any kind.

Along the far side of the corridor a line of newly arrived children in clean
clothes files past her. Not one of them looks at her. She has stopped and
raised her head to watch them go.

At her throat, a small closed ceramic disc set flush into the skin — smooth,
unopened, with no scar tissue around it.

Photoreal 65mm film still, not illustration. Cool flat interior light at 4000K,
almost no shadow, low contrast, grey on grey, cleaner than anything outside.
Real skin texture, no retouching. Minimal composition, long empty corridor.
Fine grain, ultra high detail. No text, no logo, no watermark.
```

---

# L~M. 밤 — 처음으로 위를 본다

## L-1 · 굿 〔L4〕

```
Wide cinematic still at night, composed for a 2.39:1 IMAX crop. On flat open
ground outside a tiny village, a single low fire burns. Nine cloth-wrapped
figures in smooth featureless white masks stand around it, one of them caught
mid-turn with arms out. Masked animals sit at the edge of the firelight.

Beyond them the land is completely dark and completely empty. Far off at the
horizon, a very faint band of violet haze lies low along the ground — barely
there, only a shift in colour, no shape and no source.

Photoreal 65mm film still, not illustration. Night at 3200K: warm firelight
falling off fast, deep blue ambient from the sky, no other light source. The
masks catch the fire and are the brightest thing in the frame. Desaturated
except the faint violet at the horizon. Minimal composition, mostly darkness.
Fine grain, ultra high detail. No text, no logo, no watermark.
```

## L-2 · 밤하늘의 빛 〔L24〕

```
Extreme wide cinematic still at night, composed for a 2.39:1 IMAX crop. Almost
the entire frame is night sky, dense with stars, seen from flat empty desert.
Along the very bottom edge, a thin dark silhouette of low mud-brick roofs and
four small seated figures on a platform bed.

High in the sky — lower than the stars, higher than any aircraft — a single
hard point of white light moves slowly across, leaving no trail. It is small
and completely silent and clearly artificial.

Photoreal 65mm film still, not illustration. Night at 3200K, deep blue-black,
no moon, faint starlight only. Nothing saturated. Minimal composition, the
village occupies the bottom eighth of the frame. Fine grain, ultra high detail.
No text, no logo, no watermark.
```

## M-1 · 구덩이 속 아이 〔M26〕

```
High-angle cinematic still at night, composed for a 2.39:1 IMAX crop. Looking
down into a shallow impact crater freshly punched into dry cracked earth, dust
still settling around the rim.

At the bottom lies a child of about twelve, barefoot, in a plain grey garment
that is open down the back — the same institutional grey as a hospital gown,
filthy now. The body is limp and twisted but not broken open; there is very
little blood. One hand is slightly curled.

A single hand-carried lantern from off-frame lights the crater from one side.
Everything beyond the crater rim is black.

Photoreal 65mm film still, not illustration. Night at 3200K, hard directional
lantern light, deep shadow. Desaturated. Real skin texture, dust in the hair,
no retouching, not gory. Minimal composition. Fine grain, ultra high detail.
No text, no logo, no watermark.
```

## M-2 · 일어선다 〔M51〕 — **1화 마지막 컷**

```
Low-angle wide cinematic still at night, composed for a 2.39:1 IMAX crop.
A very old woman, bent and small, is straightening up from a crouch beside a
crater in the dark ground, both hands braced on a worn wooden cane. She is
mid-motion — knees not yet locked, shoulders still coming up, weight shifting.
The effort is entirely visible in her hands and jaw.

She is a hundred and two and looks it: thick-knuckled spotted hands, white hair
tied back, layered faded cloth. Behind her, out of focus, three other very old
figures and a young man with a rifle stand watching, and further back a small
fire with masked figures around it.

Photoreal 65mm film still, not illustration. Night at 3200K, low warm lantern
light from below-left, deep blue ambient. Desaturated. Real aged skin texture,
absolutely no retouching. Minimal composition, large dark empty sky above her.
Fine grain, ultra high detail. No text, no logo, no watermark.
```

---

## 뽑고 나서 — 골라내는 기준

| | 통과 | 탈락 |
|---|---|---|
| **스케일** | 사람이 배경에 먹힌다 | 인물이 화면 절반을 차지한다 |
| **색** | 다 빠져 있다 | 하늘이 파랗거나 노을이 예쁘다 |
| **얼굴** | 모공·검버섯·먼지가 보인다 | 매끈하고 잘생겼다 |
| **빛** | 그림자가 짧고 딱딱하다 | 역광에 황금빛이 번진다 |
| **화면** | 3분의 2가 비어 있다 | 소품이 잔뜩 놓여 있다 |
| **DX** | 얼굴 자리가 그냥 판이다 | 눈이나 센서가 빛난다 |

> **제일 자주 틀리는 것 두 개:** 인물을 크게 잡는 것, 하늘을 예쁘게 만드는 것.
> 그 둘만 잡으면 나머지는 대체로 맞게 나온다.

## 2D로 갈 경우

이 파일은 **실사 기준**이다. 웹툰 2D로 간다면 각 프롬프트의 마지막 문단
(`Photoreal 65mm film still…` 이하)을 통째로 지우고,
[`style-2d.md`](style-2d.md)의 **마스터 스타일 블록**을 대신 붙인다.
장면 서술 부분은 그대로 써도 된다.
