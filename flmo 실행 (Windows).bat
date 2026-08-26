@echo off
chcp 65001 >nul
rem 이 파일을 더블클릭하면 flmo 가 실행됩니다.
rem 처음 실행할 때는 준비 작업 때문에 1~2분 걸릴 수 있습니다.

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js 가 설치되어 있지 않습니다.
  echo   https://nodejs.org 에서 LTS 버전을 내려받아 설치한 뒤 다시 실행하세요.
  echo.
  pause
  exit /b 1
)

node bin\flmo.mjs %*

echo.
pause
