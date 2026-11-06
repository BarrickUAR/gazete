#!/usr/bin/env bash
# Seçim sayfası önizlemelerini yeniden üretir. Önce: npm run build && npm start -- -p 3100
set -e
EDGE="${EDGE:-/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe}"
OUT="$(cd "$(dirname "$0")/.." && pwd -W 2>/dev/null || pwd)/public/previews"
mkdir -p "$OUT"
for i in 1 2 3 4 5 6 7 8; do
  "$EDGE" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --virtual-time-budget=6000 --window-size=1440,900 \
    --screenshot="$OUT/tasarim-$i.png" "http://localhost:3100/tasarim-$i?onizleme=1" >/dev/null 2>&1
  echo "tasarim-$i ✓"
done
