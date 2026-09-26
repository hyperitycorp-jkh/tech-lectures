# Qwen3-TTS(로컬, MLX)로 나레이션 줄들을 wav로 만든다. toolkit/tts.mjs 가 부른다.
#   ~/.local/share/qwen-tts/v/bin/python toolkit/tts/qwen.py jobs.json
# jobs.json = { "model", "voice", "instruct", "lang", "speed", "jobs": [{ "text", "out" }] }  (out 은 .wav 절대경로)
# 모델은 한 번만 로드한다. 설치: sh toolkit/tts/setup.sh
import json, os, sys, shutil, tempfile

from mlx_audio.tts.generate import generate_audio
from mlx_audio.tts.utils import load_model

cfg = json.load(open(sys.argv[1]))
model = load_model(model_path=cfg["model"])
tmp = tempfile.mkdtemp()
for i, job in enumerate(cfg["jobs"]):
    extra = {"voice": cfg["voice"]} if cfg.get("voice") else {}  # VoiceDesign 은 목소리를 instruct 로 설계
    generate_audio(text=job["text"], model=model, **extra, lang_code=cfg.get("lang", "korean"),
                   instruct=cfg.get("instruct") or None, speed=float(cfg.get("speed", 1.0)),
                   output_path=tmp, file_prefix=f"j{i}", join_audio=True, verbose=False)
    os.makedirs(os.path.dirname(job["out"]), exist_ok=True)
    shutil.move(os.path.join(tmp, f"j{i}.wav"), job["out"])
    print(f"qwen {i + 1}/{len(cfg['jobs'])}", flush=True)
shutil.rmtree(tmp, ignore_errors=True)
