# 오디오 저작권 필터 — 걸리는 것과 안 걸리는 것

> **증상:** *"저작권 보호를 위해 이 오디오를 사용하여 생성된 동영상을 표시할 수 없습니다."*
> 그림은 멀쩡한데 소리 때문에 통째로 막힌다.

## 원인

**음정이 있는 지속음은 오디오 지문에 걸린다.** 모델이 그걸 만들어내면
생성 후 검사에서 기존 음원과 매칭되어 차단된다.

## 절대 쓰면 안 되는 단어

| | |
|---|---|
| **악기 이름** | cello, drum, bell, gong, strings, horn — **하나라도 쓰면 걸린다** |
| **음정 표현** | note, tone, drone, chord, hum, resonance, sustained |
| **비유** | *"whale call과 첼로 최저음 사이"* 같은 건 최악이다 |
| **부정형만** | `No music` 만 써두면 **안 듣는다.** 뭘 낼지를 써야 한다 |

## 안전한 것 — 음정이 없는 질감음

```
wind · fabric · footsteps · gravel · water · breathing · cloth · leather
mechanical release · rails · dry metal contact · rumble · concussion
```

## 모든 AUDIO 블록 끝에 붙이는 문장

```
Every sound is unpitched and textural — no tones, no drones, no sustained
notes, no instruments, no singing.
```

## 그래도 필요하면

**분위기용 저음**은 이렇게 쓴다.

| ❌ | ✅ |
|---|---|
| a very low continuous tone between a whale call and a cello | **a low unpitched rumble like distant ground movement** |
| a slow deep bell at a steady interval | **a dull heavy impact at a steady interval** |
| a fine metallic whisper | **a dry metallic rustle** |
| chanting in a flat carrying tone | **a flat spoken cadence, unpitched** |

## 제일 확실한 방법

**대사가 없는 컷은 UI에서 오디오를 OFF로 놓고 뽑는다.**
소리는 나중에 얹는 게 어차피 낫고, 이 필터를 아예 안 만난다.

→ 대사가 있는 컷(5A "보지 마", 프롤로그 FLOW-5·6)만 오디오를 켠다.
