#!/bin/bash
# 이 파일을 더블클릭하면 flmo 가 실행됩니다.
# 처음 실행할 때는 준비 작업 때문에 1~2분 걸릴 수 있습니다.

cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo ""
  echo "  Node.js 가 설치되어 있지 않습니다."
  echo "  https://nodejs.org 에서 LTS 버전을 내려받아 설치한 뒤 다시 실행하세요."
  echo ""
  read -r -p "  엔터를 누르면 창이 닫힙니다."
  exit 1
fi

node bin/flmo.mjs "$@"

echo ""
read -r -p "  엔터를 누르면 창이 닫힙니다."
