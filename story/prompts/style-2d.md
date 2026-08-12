# 2D 스타일 규정 — 「피폭」

> 실사 프롬프트와 **병행 테스트용.** 어느 쪽으로 갈지는 뽑아보고 정한다.
> 이건 세로 스크롤 웹툰 기준이다.

---

## 이 작품의 그림이 지켜야 할 것 일곱

### 1. 선을 아낀다

**이 이야기는 담담하다.** 그림도 담담해야 한다.
굵기가 일정한 얇은 선. 속도선 없음. 집중선 없음. 해칭 없음.

> **선이 많으면 감정이 세진다.** 여기서는 감정을 그림이 아니라 **여백**이 만든다.

### 2. 그림자를 검정으로 안 칠한다

명암은 **두 번째 평면 색**으로 넣는다. 검정은 선에만 쓴다.
그라데이션은 컷당 하나까지.

### 3. 배경이 인물보다 정보가 많다

실사판의 듄 문법을 2D로 옮기면 이렇게 된다.
**인물은 단순하게, 공간은 촘촘하게.** 그러면 사람이 작아 보인다.

### 4. 눈이 작다

눈으로 감정을 그리지 않는다. 하이라이트 없음, 반짝임 없음, 속눈썹 최소.
**감정은 자세로 그린다.** 어깨, 등, 손.

> 1화에서 제일 중요한 감정 표현은 **"고개를 안 든다"**이다. 얼굴이 아니다.

### 5. 노인은 주름을 몇 개만 그린다

주름을 많이 넣으면 **캐리커처**가 된다.
- 눈가에 두 줄, 입가에 한 줄, 목에 두 줄. **그게 끝**
- 나이는 주름이 아니라 **굽은 등과 손 마디**로 그린다

### 6. 액션은 순간을 안 그린다

**전후를 그린다.**
- 때리는 컷 대신 → **날아가는 컷**
- 달리는 컷 대신 → **없는 컷** (잔상과 먼지만)
- 4초 파트 전체가 이 원칙으로 짜여 있다

### 7. 여백은 컷이다

빈 화면은 실수가 아니라 **스크롤 시간**이다. 톤 없이, 완전히 비운다.

---

## 마스터 스타일 블록

**모든 프롬프트 뒤에 통째로 붙인다. 토씨 안 바꾼다.**

```
2D illustration for a Korean vertical-scroll comic. Clean uniform line weight,
thin and unhurried, drawn by hand rather than vector-perfect — the line wobbles
slightly and breaks in places. No hatching, no cross-hatching, no speed lines,
no impact lines. Flat colour fills, three or four tones per frame, with at most
one soft gradient. Shadow rendered as a second flat colour, never black and
never a grey wash. Muted desaturated palette with a faint paper tooth over the
whole image. Faces drawn small and plain: short simple eyes with no highlight
and no sparkle, minimal lashes, mouths drawn as a single line. Backgrounds
carry more line detail than the figures. Wide composition with large areas of
empty space. Matte finish throughout.

No glossy anime rendering, no cel-shade specular highlights, no screentone, no
glow, no bloom, no lens flare, no 3D render, no photographic texture, no text,
no logo, no watermark, no signature.
```

## 파트별 색 블록

마스터 블록 **앞에** 하나 골라 붙인다.

### 눈 (프롤로그 · 2400년 과거)

```
Palette limited to paper white, two greys and one cold blue-grey. The fur coats
are the only warm value in the frame and even they are drab. Almost the entire
image is the white of the page.
```

### 밖 (현재 · 새동네)

```
Palette limited to bleached sand, dry ochre, oxidised rust-brown and a pale
grey-white sky. Nothing saturated. The brightest value in the frame is the sky
and it is still dull.
```

### 안 (벽 안 · 수련원)

```
Palette limited to four greys and one pale cold green in the shadows. No warm
colour anywhere in the frame. Any skin tone is desaturated toward the greys.
```

### 1기 (2400년 · 시설이 새것)

```
Palette limited to paper white, one light grey and one warm brass yellow.
Everything is over-bright and clean, with almost no shadow value in the frame.
The brass fittings are the only saturated colour.
```

---

## 인물 그리는 법

### 노인 넷 (분이 · 덕구 · 선생 · 막내)

| | |
|---|---|
| **몸** | 작다. 등이 굽었다. 옷이 몸보다 크다 |
| **얼굴** | 선 다섯 개 이하. 눈은 거의 선 하나 |
| **손** | **여기에 선을 쓴다.** 마디, 힘줄, 검버섯 — 얼굴보다 손이 더 자세하다 |
| **자세** | 절대 안 일어난다. 앉아 있는 실루엣이 이 넷의 정체성이다 |

> **선생은 눈을 안 뜬다.** 감은 눈을 선 하나로 그리는 게 이 인물의 전부다.

### 아이들 (12~15세)

| | |
|---|---|
| **비율** | 머리가 크고 어깨가 좁다. 목이 가늘다 |
| **옷** | **몸보다 크다.** 소매를 접고 바지를 걷었다 |
| **얼굴** | 턱선이 안 잡혀 있다. 볼이 둥글다 |
| **표정** | 무표정이 기본. **웃는 컷은 화당 한두 개만** |

> **아이가 어른처럼 나오는 건 2D에서도 똑같이 생긴다.**
> 해결책도 똑같다 — **같은 컷에 어른을 하나 넣는다.**

### 집행자

| | |
|---|---|
| **얼굴** | 없다. 매끈한 면갑에 가로선 하나 |
| **갑옷** | 여기는 선을 많이 써도 된다. **사람보다 물건이 자세하다** |
| **실루엣** | 노인들과 반대로 **각지고 크고 곧다** |

> **화면에서 집행자가 항상 더 잘 그려져 있어야 한다.** 그리고 진다.

---

## 액션 그리는 법 — 4초 파트

**이 파트가 2D 테스트의 진짜 시험이다.**

| 컷 | 그리는 것 | 안 그리는 것 |
|---|---|---|
| **지팡이** | 접혀서 날아가는 몸, 앉아 있는 분이 | **닿는 순간** |
| **덕구** | 서로 친 집행자 둘, 다시 앉은 덕구 | **달리는 덕구** |
| **선생** | 매듭 지어진 창 | **묶는 손** |
| **막내** | 하늘로 올라간 셋 | **치는 동작** |

**공통 규칙 셋**

1. **속도선을 안 쓴다.** 대신 **먼지와 잔상 면**을 쓴다
2. **분이는 앉은 자세가 절대 안 변한다.** 손만 뻗는다
3. 날아가는 몸은 **관절이 꺾여 있어야** 무게가 산다. 예쁘게 날면 안 된다

---

## 테스트 5컷

**이 다섯 개만 뽑아보면 2D로 갈지 실사로 갈지 결정된다.**

### TEST-1 · 평상의 넷 [기준]

```
Four very old people sit side by side on a low raised wooden platform in a
gravel yard, shelling beans into a shared bowl. A small bent woman with white
hair tied back and a wooden walking stick across her knees. A thin
straight-backed old man. An old man sitting upright with his eyes closed. A
fourth crouched at the end. All of them wear layered wrapped cloth washed
colourless. Nobody is looking at anybody. Behind them, a mud-brick house with a
rusted tin roof, faded laundry on a line, and flat empty ground running to a
low horizon with charred bare tree trunks.

Drawn with very few lines on the faces — no more than five each — and much more
line detail in the hands, the platform boards and the wall behind them.

[밖 색 블록] + [마스터 블록]
```

### TEST-2 · 지팡이 [액션]

```
An armoured man folded backwards in mid-air across a gravel yard, his
breastplate caved in at the chest, joints bent the wrong way, a spear spinning
away from his open hand. A flat wedge of dust bursts outward beneath him. In
the foreground, still seated on a low wooden platform and not standing, a small
old woman holds one arm extended with the tip of a wooden walking stick where
his chest was. Her posture and her expression are exactly as unbothered as
before.

Drawn with no speed lines and no impact lines. The motion is carried entirely
by the bent body, the flying spear and the flat wedge of dust.

[밖 색 블록] + [마스터 블록]
```

### TEST-3 · 눈산 [프롤로그]

```
A vast unbroken snow slope rising to a ridge, with dark rock breaking through
along the upper left and low cloud erasing the summit. Two very small figures
climb near the centre of the frame, a tall one and a much smaller one, in heavy
layered fur coats, holding hands. A single line of footprints runs back behind
them and fades. They are below one tenth of the frame height.

Almost the entire image is empty white page with only a few lines describing
the slope.

[눈 색 블록] + [마스터 블록]
```

### TEST-4 · 벽 [규모]

```
A featureless white wall running across the entire frame from edge to edge
through a flat dust plain, very tall, with no door, no window and no opening
anywhere along it. Three small cargo trucks stopped at its base are tiny
against it. A crowd of small figures stands beside them looking up. The wall
continues past both edges of the frame.

The wall is drawn as almost pure empty page with a single line for its top
edge. All the line detail in the image is in the ground, the trucks and the
figures.

[밖 색 블록] + [마스터 블록]
```

### TEST-5 · 정화실 [벽 안]

```
A long grey concrete hall with a single row of identical reclining chairs
running away into the depth of the frame, each one occupied by a small figure
in a pale uniform lying back with the collar folded open. A pale port sits at
the base of each throat with a thin line running up to a duct in the ceiling.
Nobody is restrained. Nobody is looking at anybody. One adult in a clean
uniform walks the row at full adult height, a head taller than anyone seated.

The chairs are built for adults and each figure is too small for the one they
are in. Drawn with strong one-point perspective and much more line detail in
the ceiling duct and the chairs than in the faces.

[안 색 블록] + [마스터 블록]
```

---

## 뽑고 나서 판단하는 법

| 보는 것 | 통과 기준 |
|---|---|
| **TEST-1** | 얼굴이 캐리커처가 아니고, **손이 얼굴보다 자세한가** |
| **TEST-2** | 속도선 없이 **날아가는 게 보이는가** |
| **TEST-3** | 화면의 80%가 비어 있어도 **허전하지 않은가** |
| **TEST-4** | 벽이 **크게 느껴지는가** (선이 아니라 여백으로) |
| **TEST-5** | 의자가 크고 아이가 **작아 보이는가** |

> **TEST-2와 TEST-4가 핵심이다.**
> 이 둘이 되면 2D로 가도 된다. 안 되면 실사가 맞다.

## 2D가 유리한 것 / 실사가 유리한 것

| | 2D | 실사 |
|---|---|---|
| **여백 · 침묵** | **강하다.** 빈 페이지가 컷이 된다 | 빈 프레임이 어색하다 |
| **속도 · 잔상** | **강하다.** 없는 걸 그리면 된다 | 모션블러가 지저분해진다 |
| **노인의 얼굴** | 선 몇 개로 백 살이 된다 | **강하다.** 피부가 다 말한다 |
| **피폭 흔적** | 흉해지기 쉽다 | **강하다.** 의학적으로 정확해진다 |
| **벽의 규모** | 여백으로 만든다 | **강하다.** 그냥 크게 찍으면 된다 |
| **아이 나이** | 비율로 통제 가능 | 계속 어른으로 나온다 |
| **분량** | **강하다.** 540컷이 현실적이다 | 540컷은 불가능에 가깝다 |

> **540컷짜리 웹툰이면 2D가 맞다.**
> 실사 프롬프트는 **홍보용 키비주얼과 예고편**으로 남긴다. 둘 다 쓴다.
