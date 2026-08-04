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

> 공통: 표백된 뼈흰색 사막 랩(거친 거즈 + 리넨 겹침), 낡은 가죽 끈,
> 몸에 박힌 세라믹 정화구(淨化口). 기계는 **의료용**이지 무장이 아니다.
> 등급이 높을수록 정화구가 많고, 금테가 둘러지고, 몸이 망가져 있다.

## 1. 여울 (Yeoul) — 능력 없는 아이 / 관객의 눈

**앵커:** 목 밑 정화구가 **뚜껑이 덮인 채 한 번도 열린 적 없다.** 흉터가 없는 유일한 아이.

```
A 17-year-old East Asian girl, thin and wiry, roughly self-cut short black
hair falling unevenly at the jaw, sun-scorched pale skin, a small dark mole
below the outer corner of her right eye. Wide-set eyes, short philtrum,
small flat ears. She wears a layered bone-white desert wrap of coarse gauze
and linen, frayed at the hem, cinched with worn brown leather straps
crossing the chest. At the base of her throat sits one small pale ceramic
port ring, sealed with a plain dull cap — unused, unscarred, no gold. No
prosthetics anywhere on her body. Feet bound in strips of cloth. Guarded
posture, weight on the back foot, hands loose at her sides.
```

## 2. 하란 (Haran) — 속도. 태운 만큼 늙는다

**앵커:** 19살인데 **관자놀이만 하얗게 셌다.** 팔뚝 피부 밑으로 은색 봉합사가 비친다.

```
A 19-year-old East Asian boy who reads a decade older — premature white
streaking sharply at both temples through black hair, deep fine lines at
the outer eyes, dry papery skin. Gaunt, long tendons, narrow shoulders,
a high thin nose and a long philtrum. He wears a stripped-down sleeveless
bone-white wrap, exposing forearms laced with fine silver filament sutures
visible just beneath the skin. Two pale ceramic ports set into his shoulder
blades, rimmed in dull brass, vented like gills and faintly steaming. Legs
bound in ragged linen over articulated silver ankle braces — medical
orthotics, not armour. Barefoot. He stands slightly forward on his toes.
```

## 3. 미르 (Mir) — 탄력. 쉬는 법을 모른다

**앵커:** **가만히 서 있는데도 몸이 굳어 있다.** 다리 바깥으로 은색 외골건이 케이블처럼 지난다.

```
A 20-year-old East Asian person of powerful build, broad-shouldered and
thick-necked, standing with unnatural rigidity as if braced against an
impact that never comes. Shaved head with visible scalp scarring, heavy
brow ridge, wide-set small eyes, a hard-set square jaw. Bone-white wrap
open at the chest, revealing a large grey ceramic sternum port ringed in
oxidized brass. Both legs are reinforced hip to heel with matte silver
exo-tendons running outside the skin like exposed cabling, anchored at knee
and ankle by pale ceramic sockets. Hands wrapped in scuffed leather. Feet
bare and splayed, heavy stance.
```

## 4. 세하 (Seha) — 흡수 최고 등급. 가장 아꼈고 가장 망가졌다

**앵커:** **정화구 일곱 개, 전부 금테.** 그중 몇 개는 뚜껑이 금이 가 있다.

```
An 18-year-old East Asian girl, delicate and visibly ill — translucent
pale skin, deep violet hollows beneath the eyes, long black hair thinning
at the temples and pinned back. Narrow face, large eyes, a faint blue vein
visible at the left temple. She is the most ornamented and the most
damaged: seven gold-rimmed ceramic ports set along her spine and
collarbones, each capped with fine filigree lids, two of them visibly
cracked. Thin gold chains link port to port across her collarbone. Her
wrap is the finest of them all — bleached white silk-gauze, layered and
pinned with small gold clasps. She steadies herself with one hand, head
slightly bowed, as if the air itself were heavy.
```

## 5. 소안 (So-an) — 감지. 눈이 없다

**앵커:** **회색 천으로 눈을 감았고**, 귀 뒤에 은색 전도판이 붙어 광대뼈까지 선이 지난다.

```
A 16-year-old East Asian boy, small and slight, a long band of grey cloth
bound over his eyes; beneath its edge the skin is pale and scarred. Black
hair to the jaw, parted by the band. Slim silver conduction plates are
fitted flat against the skull behind each ear, with a fine wire tracing
forward along each cheekbone. An oversized bone-white desert wrap, sleeves
falling past his fingers, gathered at the waist with rope. A single small
ceramic port at the nape. He carries a bare wooden staff. His head is
tilted slightly up and to one side, listening. Bare feet.
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
