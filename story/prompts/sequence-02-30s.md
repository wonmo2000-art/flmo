# 시퀀스 02 — 귀수 30초 (10초 × 3)

> 2026-08-04. 9A 생성이 **포인트 소모 없이 실패**한 뒤 다시 짠 것.
> 포인트가 안 나갔다는 건 생성 전에 거부됐다는 뜻 — 내용이 아니라 **형식** 문제다.

## 실패 원인 셋 (의심 순서)

| | 원인 | 대응 |
|---|---|---|
| 1 | **`@태그`** — Elements에 그 이름으로 등록 안 된 태그를 부르면 실패 | **태그를 전부 뺐다.** 이미지는 레퍼런스 슬롯에 직접 첨부 |
| 2 | **화면비 1.43:1** — 시덴스 드롭다운에 없는 값 | 텍스트에서 제거. UI에서 **1:1**, 없으면 16:9 |
| 3 | **프롬프트 길이** — 15섹션 전체가 입력 한도를 넘김 | 각 프롬프트를 4분의 1 이하로 압축 |

## 30초를 만드는 법

시덴스는 **한 번에 10초가 최대**다. 30초는 10초 세 개를 붙여서 만든다.
같은 걸 세 번 늘리는 대신, 시작·중간·끝이 있는 30초로 짰다.

> **다가가고 → 그것이 머리를 숙이고 → 데리고 떠난다.**
> 대사 한 줄 없이 이 영화의 3막이 30초에 다 들어간다.

---

## 1 — 다가간다 (10초)

```
A vast plain of cracked grey earth under dense low overcast. Five figures in
dust-worn desert layers walk slowly toward camera in a spread line, small in
frame, the centre one in a deep red cloak — the only colour in the image. Far
behind them a colossal horned beast stands chained, filling the upper half of
the frame, its two pale eyes the only bright points. Heavy iron chains run from
its neck out to both horizons.

Locked-off camera, no movement at all. The five keep walking at an even pace
and never arrive. Dust drifts across the foreground.

Photoreal, 10 seconds, one continuous shot, no cuts. Hard overcast toplight, no
cast shadow, desaturated grey monochrome broken only by the red cloak. Fine
film grain. No text, no logo, no watermark.
```

## 2 — 머리를 내린다 (10초)

> **이걸 먼저 돌린다.** 실패 원인이 태그였는지 길이였는지 이걸로 판가름난다.

```
A vast plain of cracked grey earth under dense low overcast. Five figures stand
shoulder to shoulder facing camera, small in frame, the centre one bald and
wearing a deep red cloak — the only colour in the image. Behind them a colossal
horned beast stands chained, filling the upper two thirds, two pale eyes the
only bright points.

Locked-off camera, no movement at all. The beast lowers its head steadily
toward them for the whole shot, travelling a third of the way down the frame,
still coming down when the shot ends. The chains slacken and sections drop and
strike the earth, lifting flat sheets of dust. The five hold one standing
posture — feet planted, hands open at their sides, chins level, eyes forward.
Their clothing moves in the wind; their bodies do not.

Photoreal, 10 seconds, one continuous shot, no cuts. Hard overcast toplight, no
cast shadow, desaturated grey monochrome broken only by the red cloak. Fine
film grain. No text, no logo, no watermark.
```

## 3 — 데리고 간다 (10초)

```
A vast plain of cracked grey earth under dense low overcast. Five figures in
dust-worn desert layers walk away from camera toward the horizon, small in
frame, the centre one in a deep red cloak — the only colour in the image. One
of them carries the end of a heavy iron chain that trails slack across the
ground behind them. Following them at a walk, filling the upper half of the
frame, a colossal horned beast with two pale eyes, head lowered, its chains
dragging through the dust.

Locked-off camera, no movement at all. The group walks steadily away. The beast
follows at the same pace. Nobody pulls it; it comes on its own.

Photoreal, 10 seconds, one continuous shot, no cuts. Hard overcast toplight, no
cast shadow, desaturated grey monochrome broken only by the red cloak. Fine
film grain. No text, no logo, no watermark.
```

---

## 편집

| | |
|---|---|
| 순서 | 1 → 2 → 3 |
| 이음 | 하드컷. 디졸브 금지 |
| 총 길이 | 30초 |
| 대사 | 없음 |

## 사운드

| 샷 | |
|---|---|
| 1 | 바람. 아주 멀리서 낮은 저주파 압력 |
| 2 | 사슬이 순차로 땅을 침. 저주파가 커짐 |
| 3 | 발소리 다섯 쌍 + 사슬이 모래 위를 끌리는 소리. 저주파가 잦아듦 |

## 미결

- [ ] 2번이 통과하는지 → 통과하면 태그가 원인이었던 것
- [ ] 2번도 실패하면 원인이 다른 곳 — 더 줄여야 한다
- [ ] 붉은 망토 = 여울인가 미르인가 (여기서는 이미지대로 가운데 민머리 = 미르)
