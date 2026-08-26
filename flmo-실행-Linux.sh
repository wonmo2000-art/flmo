#!/bin/bash
# 리눅스용 실행 스크립트. 실행 권한이 필요하면: chmod +x flmo-실행-Linux.sh

cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 가 설치되어 있지 않습니다. https://nodejs.org 에서 LTS 버전을 설치하세요." >&2
  exit 1
fi

exec node bin/flmo.mjs "$@"
