# 시퀀스 01 — 티저 (38초)

**구조: 겉 → 의식 → 진실 → 대가 → 추격**

벽을 보여주고, 그게 신성한 것처럼 포장돼 있음을 보여주고,
실제로 무슨 일이 벌어지는지 보여주고, 그 값을 누가 치르는지 보여주고,
도망친 자들에게 무엇이 오는지 보여준다.

> **전제:** 각 샷은 `locations.md`에서 생성한 스틸을 **첫 프레임으로 물려서** 만든다.
> 이미 생성 완료된 5장이 있다.

## 원칙

**카메라는 거의 움직이지 않는다.** 움직이는 것은 먼지와 숨과 빛뿐이다.
이 문법에서 카메라가 움직이면 힘이 빠진다.

한 샷에 **하나의 움직임만** 넣는다.

---

## S#1 — 흰 벽 (8초)

```
Use the reference image as the first frame. Locked-off camera, absolutely no
camera movement, no zoom, no pan.

The only motion in the entire frame: a faint heat shimmer rising off the sand
along the base of the wall, and the single tiny figure walking very slowly from
left to right — so small that the movement is almost imperceptible. Fine pale
dust drifts across the foreground from right to left.

The wall does not change. The light does not change. 8 seconds. No cuts.
```

## S#2 — 제의 홀 (8초)

```
Use the reference image as the first frame. Extremely slow push-in toward the
disc of light — barely perceptible, no more than a few percent over the shot.

Dust motes turn slowly inside the shaft of light. The hundreds of kneeling
figures do not move at all — completely still, no breathing, no shifting. The
single small figure standing at the centre of the light slowly raises their
head toward the aperture above.

8 seconds. No cuts. Nothing else moves.
```

## S#3 — 정화실 · 흡수 (6초)

> 등장인물: **세하**와 **카일란**.
> 아이 쪽 정화구에 금테가 둘려 있으므로 등급이 가장 높은 아이 = 세하.

```
Use the reference image as the first frame. Locked-off camera, no movement.

The ribbed tubes running up from the girl's spine into the darkness pulse once,
slowly — a visible swelling that travels upward along the tubes and disappears
into the black above. Her shoulders rise and fall with a single slow breath.

The old man in gold does not move at all.

6 seconds. No cuts.
```

## S#4 — 정화실 · 값 (6초)

```
Use the reference image as the first frame. Locked-off camera, identical
framing to the previous shot, no movement.

The girl's head lowers slowly, chin toward her chest, and stops. At the same
moment, across the room, the old man's head tilts back and his chest lifts as
he draws a deep, satisfied breath. The tubes settle and go slack.

6 seconds. No cuts.
```

> **이 두 컷이 붙는 것이 시퀀스의 핵심.**
> 아이가 내려가고, 같은 순간에 노인이 올라간다. 대사 없이 거래가 끝난다.

## S#5 — 집행자 (10초)

```
Use the reference image as the first frame. Locked-off camera, no movement.

The eight armoured figures advance directly toward camera across the dune,
slow and perfectly even, in step, cloaks dragging heavily through the sand.
The line does not break and does not accelerate. Behind them, thick backlit
dust rolls forward toward the camera, gradually filling the frame.

They do not reach the camera before the shot ends.

10 seconds. No cuts.
```

> **닿기 전에 끝나는 것**이 중요하다.
> 다가오는데 도착하지 않으면 관객은 계속 기다리게 된다.

---

## 편집

| | |
|---|---|
| 컷 | 전부 하드컷. **디졸브 금지** |
| 컷 지점 | 움직임이 **멈춘 순간**에 자른다. 움직이는 중에 자르지 않는다 |
| 총 길이 | 38초 (+ 타이틀 3초) |
| 대사 | 없음 |

## 사운드

| 샷 | |
|---|---|
| S#1 | 바람만 |
| S#2 | 방 울림. 아주 먼 웅성거림, 말은 안 들림 |
| S#3 | **여기서 처음으로 기계음.** 낮고 느린 펌프 소리 |
| S#4 | **펌프 소리가 멈춘다** |
| S#5 | 발소리 여덟 쌍. 그 외 없음 |

> **S#4에서 소리가 멈추는 것이 이 시퀀스의 유일한 극적 사건이다.**
> 그때까지 깔려 있던 펌프 소리가 끊기면 관객은 뭔가 끝났다는 걸 안다.

## 타이틀

검은 화면. **피폭** 두 글자. 3초. 소리 없음.

---

## 미결

- [ ] S#1의 걸어가는 인물은 누구인가 — 여울? 리안? 아니면 무명의 아이?
- [ ] S#2 빛 한가운데 선 인물은 누구인가
- [ ] 티저를 이대로 갈지, 아니면 마지막에 아이들 얼굴 한 컷을 더할지
      (지금 구성에는 **얼굴이 하나도 없다.** 의도라면 그대로 두는 게 맞다)

---

# 통합 버전 — 한 프롬프트로

시덴스 2.0의 멀티샷 기능으로 컷까지 한 덩어리에 넣은 버전.

> ⚠️ **주의:** 프롬프트가 길어질수록 뒤쪽 샷에서 흔들린다.
> 특히 **S#3과 S#4의 인물이 같은 사람으로 유지되는지**가 가장 위험한 지점.
> 거기가 무너지면 시퀀스의 핵심이 날아간다.
> 흔들리면 위의 분리 프롬프트로 각각 뽑아서 붙일 것 —
> 이미 생성한 스틸을 첫 프레임으로 물릴 수 있어 일관성도 그쪽이 안전하다.

```
One continuous cinematic sequence, 38 seconds, five locked-off shots joined by
hard cuts — no dissolves, no fades, no transitions of any kind between shots.
Anamorphic 2.39:1 throughout. Photoreal, large-format, one single hard light
source in every shot, deep crushed blacks, desaturated. Fine film grain. No
dialogue, no music, no on-screen text except where stated. Camera is locked off
in every shot unless stated otherwise.

SHOT 1 — 8 seconds. EXTERIOR. DESERT. MIDDAY.
Extreme wide. One vast white concrete wall runs unbroken across the entire
frame, sixty metres high, its top edge dead level against a bleached white sky.
No gate, no window, no marking. Pale sand meets its base undisturbed. At the
foot of the wall a single human figure, so small as to be almost invisible.
The only motion: faint heat shimmer along the base of the wall, the tiny figure
walking very slowly from left to right, fine pale dust drifting across the
foreground. Harsh vertical sun, almost no shadow. Monochrome — bleached
concrete, pale sand, white sky.

HARD CUT.

SHOT 2 — 8 seconds. INTERIOR. RITUAL HALL.
Extreme wide, symmetrical. An immense windowless hall of raw grey concrete, its
ceiling lost in darkness. High in the far wall a single circular aperture admits
one hard shaft of white light that lands as a perfect disc on the floor far
below. Hundreds of figures in plain white robes kneel in concentric rings around
the disc, heads bowed, completely motionless — no breathing, no shifting. One
small figure stands alone at the centre of the light. Camera pushes in extremely
slowly, only a few percent across the whole shot. Dust motes turn inside the
shaft. The figure at the centre slowly raises their head toward the aperture.
Everything outside the disc falls into near-black.

HARD CUT.

SHOT 3 — 6 seconds. INTERIOR. CONCRETE CHAMBER.
Wide, symmetrical, two plain metal chairs facing each other across three metres
of bare floor in a grey concrete room, ceiling lost in darkness. Left chair: a
thin young woman sits upright, her bone-white wrap opened at the back, a row of
small gold-rimmed ceramic ports set down her spine, ribbed grey tubes running
from them straight up into the blackness overhead. Right chair: an old man in
heavy oxidized-gold ceremonial robes, a gold filigree plate seamed into his left
temple, identical tubes descending out of the dark into a jewelled port at his
throat. Neither looks at the other. One hard overhead light. The tubes pulse
once, slowly — a visible swelling travelling upward from her spine into the
black. Her shoulders rise and fall with a single breath. The old man does not
move at all.

HARD CUT.

SHOT 4 — 6 seconds. SAME CHAMBER, IDENTICAL FRAMING, SAME TWO PEOPLE.
Nothing in the composition has changed. The young woman's head lowers slowly,
chin toward her chest, and stops. At the same moment, across the room, the old
man's head tilts back and his chest lifts as he draws a deep, satisfied breath.
The tubes settle and go slack.

HARD CUT.

SHOT 5 — 10 seconds. EXTERIOR. DUNE FIELD. LOW SUN.
Extreme wide, low angle. Eight armoured figures advance directly toward camera
across the sand — black lacquered armour with fine gold filigree, deep umber
cloaks dragging heavily, long spears held vertical. They move slowly, perfectly
even, in step. The line does not break and does not accelerate. Behind them
thick backlit dust rolls forward, gradually filling the frame. Hard low raking
sunlight, long black shadows, warm desaturated gold and umber. They do not reach
the camera before the shot ends.

CUT TO BLACK.

3 seconds of pure black. No sound.
```
