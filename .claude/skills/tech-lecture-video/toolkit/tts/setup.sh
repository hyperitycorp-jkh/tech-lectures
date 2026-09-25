#!/bin/sh
# Qwen3-TTS 로컬 음성 설치 (Apple Silicon). 한 번만 실행.
#   sh toolkit/tts/setup.sh
# 실행환경 ~/.local/share/qwen-tts/v (약 0.4GB), 모델은 첫 렌더 때 Hugging Face 캐시로 자동 다운로드 (약 2.9GB)
set -e
DIR="$HOME/.local/share/qwen-tts"
mkdir -p "$DIR"
command -v uv >/dev/null || { echo "uv 가 필요합니다: brew install uv"; exit 1; }
[ -x "$DIR/v/bin/python" ] || uv venv -q -p 3.12 "$DIR/v"
VIRTUAL_ENV="$DIR/v" uv pip install -q mlx-audio
"$DIR/v/bin/python" -c "import mlx_audio" && echo "ok → $DIR/v (다른 경로면 환경변수 QWEN_PY 로 지정)"
