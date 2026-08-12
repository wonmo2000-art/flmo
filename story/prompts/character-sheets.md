# 캐릭터 시트 프롬프트 — Seedance 2.0

**용도:** 캐릭터 아이덴티티 레퍼런스 생성. 여기서 나온 이미지가 이후 모든 샷의 기준이 된다.

## 사용 규칙 (반드시 지킬 것)

1. **레퍼런스는 3장.** 정면 / 3-4분면 / 측면. 그 이상 만들지 않는다.
2. **같은 세션, 같은 조명에서 뽑는다.** 조명이 바뀌면 아이덴티티가 흔들린다.
3. **아래 문장을 토씨 하나 바꾸지 말고 재사용한다.** 캐릭터 드리프트는 대부분 여기서 시작한다.
4. 표정은 무표정, 모션 블러 없음, 배경은 무지.
5. 드리프트는 실루엣이 아니라 **미세 특징**(눈 간격, 인중 길이, 귀 모양, 헤어라인)에서 먼저 온다.
   그래서 캐릭터마다 **앵커 특징**을 하나씩 박아뒀다. 그건 절대 빼지 말 것.

---

## 공통 블록 A — 스타일 (모든 프롬프트 끝에 붙인다)

```
cinematic photoreal, large-format 65mm look, neutral warm-grey seamless
studio backdrop, soft overhead key with gentle fill, long soft shadow on
floor, muted desert palette — bone white, sand beige, oxidized gold, cold
silver, deep umber. Fine sand dust on skin and fabric. Flat neutral
expression, no motion blur, no dramatic pose. Full body, feet visible.
No text, no logo, no watermark.
```

## 공통 블록 B — 턴어라운드 레이아웃

```
Character turnaround sheet. The same single character repeated three times
in one frame, evenly spaced: front view, three-quarter view, profile view.
Identical lighting, identical costume, identical proportions across all
three. Same character as references: one consistent identity.
```

> **영상 버전이 필요하면** 블록 B 대신:
> `Locked-off camera. The character stands still on a turntable and rotates
> a slow, even 360 degrees. No cuts, no zoom, no expression change.`

---

# 아이들 — 정화구를 가진 자들

**여자 셋 · 남자 둘.** 여울(여) · 세하(여) · 미르(여) · 하란(남) · 소안(남)

> 공통: 표백된 뼈흰색 사막 랩(거친 거즈 + 리넨 겹침), 낡은 가죽 끈,
> 몸에 박힌 세라믹 정화구(淨化口). 기계는 **의료용**이지 무장이 아니다.
> 등급이 높을수록 정화구가 많고, 금테가 둘러지고, 몸이 망가져 있다.

## 공통 블록 C — 피폭 (아이들 전원에게 붙인다)

> 실제 급성/만성 방사선 장해 소견에 근거한다. **장식이 아니다.**
> 마지막 두 문장이 이 블록의 핵심이다 — 그게 톤을 잡는다.

```
Visible radiation damage, medically grounded and never decorative: irregular
patches of hair loss across the scalp; skin unevenly depigmented in pale
blotches against darker areas; old keloid scarring, raised and shiny, ringing
every ceramic port; faint purpura — small dark bruises — scattered over the
forearms and shins; fingernails ridged, thickened and discoloured; skin thin
enough that veins read clearly at the temples and the backs of the hands.

They are clean, well-fed and carefully kept. The damage is not neglect.
It is use.
```

> 개별 프롬프트에 정도를 조절해 넣는다.
> **여울은 거의 없고, 세하는 가장 심하다.** 그 낙차가 이 다섯을 설명한다.

---

## 1. 여울 (Yeoul) · 여 — 능력 없는 아이 / 관객의 눈

**앵커:** 목 밑 정화구가 **뚜껑이 덮인 채 한 번도 열린 적 없다.** 흉터가 없는 유일한 아이.

> **여울에게는 피폭 흔적이 거의 없다.** 한 번도 쓰이지 않았기 때문이다.
> 그리고 **그 건강함이 곧 그녀의 무가치함**이다 — 쓸모가 없어서 폐기 직전이었다.
> 다섯 중 유일하게 성한 몸이 화면에 있으면, 나머지 넷이 무엇을 잃었는지 보인다.

```
A 17-year-old East Asian girl, thin and wiry, roughly self-cut short black
hair falling unevenly at the jaw, sun-scorched skin, a small dark mole below
the outer corner of her right eye. Wide-set eyes, short philtrum, small flat
ears. Her body is almost undamaged — a full head of hair, even skin tone,
clear nails — startlingly intact next to the others. She wears a layered
bone-white desert wrap of coarse gauze and linen, frayed at the hem, cinched
with worn brown leather straps crossing the chest. At the base of her throat
sits one small pale ceramic port ring, sealed with a plain dull cap — unused,
unscarred, no keloid ring around it, no gold. No prosthetics anywhere on her
body. Feet bound in strips of cloth. Guarded posture, weight on the back foot,
hands loose at her sides.
```

## 2. 하란 (Haran) · 남 — 속도. 태운 만큼 늙는다

**앵커:** 19살인데 **관자놀이만 하얗게 셌다.** 팔뚝 피부 밑으로 은색 봉합사가 비친다.

```
A 19-year-old East Asian boy who reads a decade older — premature white
streaking sharply at both temples through black hair, with irregular bald
patches of hair loss above the left ear and at the crown. Deep fine lines at
the outer eyes, dry papery skin unevenly depigmented in pale blotches across
the throat and shoulders. Gaunt, long tendons, narrow shoulders, a high thin
nose and a long philtrum. Fingernails ridged and yellowed; small dark bruises
scattered along both shins. He wears a stripped-down sleeveless bone-white
wrap, exposing forearms laced with fine silver filament sutures visible just
beneath thin skin. Two pale ceramic ports set into his shoulder blades, each
ringed with raised shiny keloid scarring, rimmed in dull brass, vented like
gills and faintly steaming. Legs bound in ragged linen over articulated
silver ankle braces — medical orthotics, not armour. Barefoot. He stands
slightly forward on his toes.
```

## 3. 미르 (Mir) · 여 — 탄력. 쉬는 법을 모른다

**앵커:** **가만히 서 있는데도 몸이 굳어 있다.** 다리 바깥으로 은색 외골건이 케이블처럼 지난다.

> 다섯 중 몸이 가장 크다. 넓은 어깨, 굵은 목, 민머리, 충격을 받아내는 몸.
> **그 몸을 여자에게 준다.** 세하는 부서지기 직전이고, 여울은 아무것도 없고,
> 미르는 벽처럼 서 있다 — 이 낙차가 앙상블을 만든다.

```
A 20-year-old East Asian woman of powerful build, broad-shouldered and
thick-necked, standing with unnatural rigidity as if braced against an impact
that never comes. Shaved head showing scalp mottled with old keloid scarring
and irregular pale depigmented patches, heavy brow ridge, wide-set small eyes,
a hard-set square jaw. Fingernails thickened and ridged; dark bruises across
both forearms. Bone-white wrap open at the chest, revealing a large grey
ceramic sternum port ringed with raised shiny scar tissue and oxidized brass.
Both legs are reinforced hip to heel with matte silver exo-tendons running
outside the skin like exposed cabling, anchored at knee and ankle by pale
ceramic sockets, the skin around each socket thickened and discoloured. Hands
wrapped in scuffed leather. Feet bare and splayed, heavy stance.
```

## 4. 세하 (Seha) · 여 — 흡수 최고 등급. 가장 아꼈고 가장 망가졌다

**앵커:** **정화구 일곱 개, 전부 금테.** 그중 몇 개는 뚜껑이 금이 가 있다.

```
An 18-year-old East Asian girl, delicate and visibly ill — translucent skin
thin enough that the veins read blue at her temples and the backs of her
hands, deep violet hollows beneath the eyes. Long black hair thinned to
patchiness, gone entirely above both temples, the remainder pinned back to
cover the loss. Narrow face, large eyes. Dark purpura bruising across both
forearms; nails ridged, thickened, discoloured. She is the most ornamented
and the most damaged: seven gold-rimmed ceramic ports set along her spine and
collarbones, each ringed with thick raised keloid scarring and capped with
fine filigree lids, two of them visibly cracked. Thin gold chains link port to
port across her collarbone. Her wrap is the finest of them all — bleached
white silk-gauze, layered and pinned with small gold clasps. She steadies
herself with one hand, head slightly bowed, as if the air itself were heavy.
```

## 5. 소안 (So-an) · 남 — 감지. 눈이 없다

**앵커:** **회색 천으로 눈을 감았고**, 귀 뒤에 은색 전도판이 붙어 광대뼈까지 선이 지난다.

> 방사선 백내장은 실제 피폭 후유증이다. **소안의 실명은 설정이 아니라 증상이다.**

```
A 16-year-old East Asian boy, small and slight, a long band of grey cloth
bound over his eyes; beneath its edge the skin is pale, scarred and mottled
with depigmented patches. Black hair to the jaw, parted by the band, thinning
badly at the crown with a bare patch above the right ear. Slim silver
conduction plates are fitted flat against the skull behind each ear, the skin
around them raised and shiny with scarring, with a fine wire tracing forward
along each cheekbone. Small dark bruises on both forearms; nails ridged and
discoloured. An oversized bone-white desert wrap, sleeves falling past his
fingers, gathered at the waist with rope. A single small ceramic port at the
nape, keloid-ringed. He carries a bare wooden staff. His head is tilted
slightly up and to one side, listening. Bare feet.
```

---

# 상류층 — 금으로 된 기계

## 6. 카일란 (Kailan) — 대주교. 죽어가면서 확신에 차 있다

**앵커:** **왼쪽 관자놀이와 뺨이 금 세공판으로 대체됐다.** 목의 금 정화구는 아이들 것과 같은 모양인데 보석이 박혀 있다.

```
An East Asian man in his sixties, gaunt and grey-bearded, unmistakably
dying — yellowed sclera, sunken cheeks, thin neck — yet immaculately kept.
Heavy oxidized-gold ceremonial robes over black under-layers, the stiff
collar rising behind his head like a sun disc. Ornate gold cybernetics: a
filigreed gold plate replaces his left temple and cheek, seamed into the
skin; his left hand is gold-jointed articulated segments; a jewelled gold
intake port sits at his throat, the same shape as the children's but
studded. He holds a slender ceremonial rod in the living right hand. His
expression is gentle, exhausted, and absolutely certain.
```

## 7. 베르잔 (Berzan) — 집행자. 한때 그 아이들 중 하나였다

**앵커:** **목에 낡은 정화구 흉터.** 갑옷 틈으로 은색 관절이 드러난다.

```
A tall armoured East Asian man in his late twenties, face bare and hard,
close-cropped black hair, a broken nose, and a faded circular ceramic port
scar at the hollow of his throat — he was one of the children once. Black
lacquered armour chased with fine gold filigree across chest and pauldrons,
the plates fitted over an exposed underlayer of silver cybernetic joints at
elbows, knees and spine. A sand-worn deep-umber cloak. He holds a long
spear butt-down against the floor; a straight sword hangs at his hip.
Utterly still, weight even on both feet.
```

---

## 테스트 순서 제안

1. **여울**부터 뽑는다. 가장 단순하고 기계가 거의 없어서, 스타일 블록이 제대로 먹는지 확인하기 좋다.
2. 여울이 잘 나오면 **세하** — 정화구 장식이 가장 복잡하다. 여기가 되면 나머지는 다 된다.
3. 그다음 **베르잔** — 갑옷 + 노출 관절 조합 확인.

각 캐릭터당 3장(정면/3-4/측면)을 **한 세션에서** 뽑고, 마음에 드는 세트를 확정한 뒤에는
그 이미지를 레퍼런스로 물리고 위 문장을 그대로 재사용한다.

---

# 추가 캐릭터 (2026-08-04 3차)

> 아래 둘은 원모가 새로 제시한 레퍼런스에서 나왔다.
> **스타일 블록이 위와 다르다.** 진영마다 색과 조명이 다르기 때문 → `../visual.md` 참조.

## 8. 리안 (Rian) — 먼저 나온 아이. 붕대 밑에 정화구가 있다

**앵커:** 왼쪽 눈썹의 흉터 / 금 고리 귀걸이 한 쌍 / **붕대 사이로 비치는 손목 정화구**

**설정:** 이전 기수의 탈옥자. 자기가 무엇인지 감추려고 손과 팔뚝을 붕대로 감는다.
칼은 집행자에게서 빼앗은 의식용 검.

```
A 19-year-old East Asian woman, small and slight, with messy shoulder-length
black hair in soft waves, an uneven fringe falling across her forehead. Pale
skin with a natural flush high on the cheeks, large dark brown eyes, a small
full mouth, a faint scar through the left eyebrow. Thin gold hoop earrings,
one in each ear, a fine gold chain at the collarbone. She wears an oversized
loose cream-white linen tunic, sleeves pushed back, over a long charcoal-black
wrapped skirt cinched with a wide dark sash. Both forearms and hands are wound
thickly in pale mint-green and dusty-pink bandages, frayed at the ends —
beneath the gauze at the wrists, slim silver cybernetic joint seams and the
edge of a pale ceramic port show where the wrapping has slipped. She holds a
long ornate sword point-down in front of her with both bandaged hands: an old
ceremonial blade, gold crossguard, lavender-wrapped grip. She looks straight
into the lens, calm, level, unsmiling.
```

**스타일 블록 — 파스텔 (아이들 진영)**

```
cinematic photoreal, medium-format portrait, heavy diffusion filter, low
contrast, lifted blacks, soft overcast key with no hard shadow. Pastel grade —
powder pink, mint, dusty lavender, cream, faint sky blue. Gentle bloom in the
highlights, fine film grain, painterly and almost bleached. Waist-up framing,
shallow depth. No text, no logo, no watermark.
```

> 턴어라운드로 쓰려면 공통 블록 B를 맨 앞에 붙이고,
> `Waist-up framing, shallow depth` → `Full body, feet visible`로 바꾼다.

---

## 9. 아셰라 (Ashera) — 제의 집전자. 얼굴이 없다

**앵커:** **후드 그림자에 잠긴 얼굴 — 턱과 입만 보인다** / 머리 뒤의 거대한 원반 /
오른팔만 기계

**설정:** 상류층 제의 계급. 머리 뒤의 원반은 사막 협곡의 태양·눈(眼) 제단과 같은 형상이다.
사람이 곧 제단이 된 형태.

> **규칙: 상류층은 얼굴을 보이지 않는다. 얼굴이 있는 것은 아이들뿐이다.**

```
A tall, statuesque woman standing frontally, her face almost entirely lost in
the deep shadow of a hood — only the lower jaw, mouth and chin catch the light.
Long black hair falls from beneath the hood across her shoulders. She wears an
enormous circular halo headdress rising behind her head like a full disc, its
surface a lacquered cloisonné of cobalt blue, teal, coral orange and cream in
flowing organic shapes, edged in tarnished bronze. Over her chest and shoulders
sits an ornate ceremonial cuirass of aged bronze scrollwork set with round
cabochon stones — cobalt, turquoise, amber — following the curve of the body.
Her right arm is a heavy blackened cybernetic prosthetic of overlapping ornate
plates with inset jewels at the joints, ending in a gauntleted metal hand. Her
left arm is bare, dark-skinned. She wears a long column of cream-white silk
falling straight to the floor, and a heavy cobalt-blue mantle patterned with
swirling teal and orange forms sweeping behind her. In her right hand a massive
ceremonial greatsword held point-down, its guard a mass of bronze scrollwork and
blue stones. In her left, a long slender sceptre topped with an iridescent orb.
```

**스타일 블록 — 성화 (상류층 진영)**

```
cinematic photoreal, medium-format, full-body frontal portrait against a
seamless pure white backdrop, high-key lighting, very soft and even, almost no
cast shadow — graphic and flat like a devotional painting. Saturated jewel
palette — cobalt, teal, coral, cream, tarnished bronze — against white. Crisp
detail in the metalwork and enamel, fine film grain. Face deliberately obscured
in hood shadow. No text, no logo, no watermark.
```

---

## 10. 네반 (Nevan) — 최상층. 얼굴을 가리지 않는다

**앵커:** 금빛 눈 / 이마의 금 세공 / 길게 뻗은 귀 / 검은 장갑의 발톱 같은 손가락판

**설정:** 카일란과 아셰라가 섬기는 자리.

수백 년치 정화를 사서 마신 끝에 **다른 방향으로 변이한 상류층.**
아이들은 피폭으로 힘을 얻었고, 이쪽은 수명과 기이함을 얻었다.
같은 방사능이 한쪽은 무기로, 한쪽은 신으로 만들었다.

> **얼굴을 드러낸다.** 상류층은 얼굴을 가린다는 규칙의 예외.
> 가릴 상대가 위에 없기 때문이다.

**색:** 검정과 금뿐. 아셰라의 코발트는 중간 제의 계급의 화려함이고,
최상층은 색을 쓸 필요가 없을 만큼 위에 있다.

### A. 캐릭터 레퍼런스 — 와이드 프레임, 인물 크게

```
Cinematic wide frame, 2.39:1 anamorphic. A tall androgynous figure stands on a
flat pale salt plain that runs unbroken to the horizon, placed in the right
third of the frame; the upper two-thirds is an immense overcast sky of cold
blue-grey with soft painterly cloud banks. Medium-wide framing, knees up.

Deep near-black skin with a faint warm sheen. An enormous mane of white-silver
curls falling past the waist, lifted and streaming to one side in the wind.
Long, pointed, elongated ears. Pale golden-amber eyes, startlingly light against
the dark skin, with a level unblinking gaze. Fine gold filigree markings traced
across the forehead and temples, and a small gold ornament fixed at the
hairline. Single pearl drop earrings. They wear a floor-length high-collared
black robe of heavy matte cloth, closed down the chest with slim gold chain
fastenings set with small dark red stones, gold piping at the shoulder seams,
and a stiff gold-edged shoulder cape. The right hand is sheathed in a black
glove with long tapering articulated finger-plates, almost claw-like. Stacked
gold cuff rings at the left wrist. In the left hand a slender straight sword
with an ornate gold hilt, held point-down at the side. Turned three-quarters
toward camera, chin slightly lowered, looking directly into the lens.

cinematic photoreal, anamorphic 2.39:1, large-format, overcast diffuse daylight,
cool desaturated grade — black, gold, bone white, cold blue-grey. Deep detail in
fabric and metal, hair rendered strand-fine and wind-lifted. Slight anamorphic
flare, fine film grain. No text, no logo, no watermark.
```

### B. 실제 샷용 와이드 — 인물 작게, 하늘이 먹는다

아이맥스 원칙에 맞는 건 이쪽. **은백색 머리가 화면에서 유일하게 밝은 것**이 되도록 짰다.

```
Extreme wide cinematic shot, 2.39:1 anamorphic. A lone tall figure in a
floor-length black robe stands far off on a vast flat pale salt plain, small in
frame, occupying barely a tenth of the image height, positioned on the right
third line. An enormous mane of white-silver hair streams sideways in the wind —
the only bright thing in the landscape. A slender sword hangs point-down at
their side. The horizon sits low; the upper three-quarters of the frame is an
immense cold blue-grey overcast sky with slow painterly cloud banks. Nothing
else in the landscape. No other figures.

cinematic photoreal, anamorphic 2.39:1, large-format, flat diffuse overcast
light, cool desaturated grade — black, bone white, cold blue-grey. Vast negative
space, oppressive scale, the figure dwarfed by sky. Fine film grain, slight
anamorphic flare. No text, no logo, no watermark.
```

---

# 탈옥 이후 버전 (B) — 2026-08-04 5차

> 앞의 것은 **A. 시설 버전** — 맨몸, 의료 기계, 손상이 다 보인다.
> 여기부터는 **B. 탈옥 이후** — 집행자를 죽이고 벗겨낸 갑옷을 입고 있다.

## 왜 갑옷이 멋있어도 되는가

**저 갑옷은 훔친 것이다.**
착취의 도구였던 아이들이 **착취자의 갑옷을 입고** 있다.
몸에 안 맞아 잘라내고 끈을 다시 박았고, 그 밑으로 여전히 망가진 몸이 보인다.

그래서 B는 멋있어도 이야기가 흐려지지 않는다. 오히려 선명해진다.

---

## 공통 블록 D — 실사 강화

> 시덴스는 놔두면 자꾸 예쁘게 만든다. **`Photographed, not illustrated`**와
> **`no beauty retouching`**이 그걸 막는다. 이 블록이 실사감의 전부다.

```
Photographed, not illustrated. Shot on large-format digital, 65mm, T2.8.
Real skin texture — visible pores, fine facial hair, uneven tone, subsurface
translucency at the ears and nostrils. Real materials — metal with genuine
wear, scratches, oxidation and fingerprints; cloth with visible weave and dust
caught in the fibres. Naturally imperfect facial symmetry. No airbrushing, no
illustration, no painterly rendering, no CGI sheen, no beauty retouching.
```

## 공통 블록 E — 탈옥 이후 의상

```
Salvaged enforcer armour, taken from the dead: black lacquered plate chased
with fine gold filigree, cut down and re-riveted to fit a smaller frame, straps
mismatched and knotted. Exposed silver cybernetic joints beneath. Worn over the
same bleached bone-white desert wrap they wore inside — the armour is stolen,
the white cloth is theirs. Sand in every seam.
```

> **흰 천은 자기 것이고 갑옷은 남의 것이다.** 다섯이 한 무리로 읽히는 이유가 이것이다.

---

## B-1. 여울 — 갑옷이 가장 적고, 가장 눈에 띈다

> **붉은 망토를 여울에게 준다.** (제안 — 원모 확정 대기)
> 보호가 가장 적은 아이가 화면에서 가장 잘 보인다.
> 규칙대로라면 **여울이 죽는 순간 화면에서 색이 사라진다.**

```
A 17-year-old East Asian girl, thin and wiry, roughly self-cut short black hair,
a small dark mole below the outer corner of her right eye. Her body is almost
undamaged — startlingly intact next to the others. She wears a deep red hooded
cloak, sun-bleached and torn at the hem, over a bone-white desert wrap. A single
black-and-gold pauldron is strapped to her left shoulder, clearly too large for
her, the only armour she has. One small pale ceramic port at the base of her
throat, still capped, still unscarred. No prosthetics. Feet bound in cloth. She
carries nothing. Hood back, face bare, looking straight into the lens.
```

## B-2. 하란 — 속도를 위해 다 벗었다

```
A 19-year-old East Asian boy who reads a decade older — white streaking sharply
at both temples, bald patches above the left ear and at the crown, dry papery
skin blotched with pale depigmentation. Gaunt, long tendons. A grey scarf wound
over his nose and mouth against the dust, pulled down beneath his chin. Bare
arms, forearms laced with silver filament sutures under thin skin. Two ceramic
ports in his shoulder blades, now fitted with scavenged brass cowls that vent
faint steam. A single black-and-gold vambrace on the right forearm. Legs bound
in ragged linen over articulated silver braces reinforced with cut enforcer
plate. Barefoot. Weight forward on his toes.
```

## B-3. 미르 — 멀리서 보면 집행자로 보인다

> 이건 그냥 디자인이 아니라 **플롯이 될 수 있다.**

```
A 20-year-old East Asian woman of powerful build, broad-shouldered and
thick-necked, standing with unnatural rigidity. Shaved head, scalp mottled with
keloid scarring and pale depigmented patches, heavy brow ridge, hard square jaw.
She wears a full enforcer cuirass of black lacquered plate with gold filigree,
cut open at the sides and re-riveted with rough leather straps to fit her wider
frame, over a bone-white wrap. Heavy gauntlets. Her grey ceramic sternum port
shows through a cut in the breastplate, keloid-ringed. Both legs reinforced hip
to heel with matte silver exo-tendons running outside the skin, now sheathed in
scavenged greaves. Feet bare and splayed, heavy stance.
```

## B-4. 세하 — 금을 입어서 그들처럼 보인다

> 금테 정화구와 훔친 금 망토가 **같은 금**이다.
> 언뜻 보면 상류층으로 읽힌다. 가장 착취당한 아이가 착취자처럼 보인다.

```
An 18-year-old East Asian girl, delicate and visibly dying — translucent skin,
veins blue at the temples, deep violet hollows beneath the eyes, long black hair
thinned to patchiness and gone above both temples. Too weak to carry armour. She
wears a heavy black-and-gold hooded mantle taken from a priest, far too large,
dragging behind her, over her own bleached white silk-gauze wrap. Seven
gold-rimmed ceramic ports along her spine and collarbones, keloid-scarred, two
cracked, linked by thin gold chains — the same gold as the stolen mantle, so
that at a glance she reads as one of the upper class. Head slightly bowed. One
hand steadying herself.
```

## B-5. 소안 — 눈먼 아이가 눈 구멍 뚫린 가면을 쓴다

> 원모가 제시한 레퍼런스(세공 가면 + 후드) 그대로.
> **앙상블에서 가장 좋은 그림.** 볼 수 없는 아이의 얼굴에 눈 구멍이 뚫려 있다.

```
A 16-year-old East Asian boy, small and slight. Over the grey cloth bound across
his eyes he wears a close-fitting face mask of dark tarnished metal, chased with
fine gold filigree in flowing lines, with narrow eye slits cut into it — taken
from an enforcer, worn to shield the silver conduction plates fitted flat behind
each ear. Beneath its lower edge, jaw and mouth bare, skin pale and mottled.
Black hair to the jaw, thinning badly at the crown. A hooded grey mantle over an
oversized bone-white wrap, sleeves past his fingers. A single keloid-ringed
ceramic port at the nape. He carries a bare wooden staff. Head tilted slightly
up and to one side, listening.
```

---

## 조립법

**A(시설)** = 턴어라운드 B + 캐릭터 A + 피폭 C + **실사 D**
**B(탈옥 후)** = 턴어라운드 B + 캐릭터 B + 피폭 C + **실사 D**

> 블록 D는 A·B 양쪽 모두에 붙인다. 실사감은 여기서 나온다.

## 미결

- [ ] **붉은 망토 = 여울** 확정 여부
- [ ] 미르가 집행자로 오인받는 장면을 실제로 쓸 것인가
