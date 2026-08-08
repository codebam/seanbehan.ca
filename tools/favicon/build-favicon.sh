#!/usr/bin/env bash
# Renders the f1 favicon (cream serif SB on rust) at every size we ship.
#
# Each size is rendered natively by Chromium rather than downscaled from one
# master, so the small sizes get their own hinting pass instead of inheriting
# a blurry resample. 16 and 32 use a tuned variant: heavier weight, tighter
# tracking and a smaller corner radius, because the default proportions turn
# to mush at tab size.
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
FONT="/home/codebam/Documents/git/seanbehan.ca/node_modules/@fontsource-variable/newsreader/files/newsreader-latin-standard-normal.woff2"
OUT="$DIR/out"
mkdir -p "$OUT"

# $1 = output html, $2 = font-size, $3 = weight, $4 = tracking, $5 = radius, $6 = baseline
page() {
	cat >"$1" <<EOF
<!doctype html><html><head><meta charset=utf-8><style>
@font-face{font-family:'Newsreader';src:url('file://$FONT') format('woff2-variations');font-weight:200 800}
html,body{margin:0;padding:0;background:transparent}
svg{display:block;width:100vw;height:100vw}
</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="$5" fill="#a8391f"/>
  <text x="32" y="$6" text-anchor="middle" font-family="Newsreader" font-weight="$3"
    font-size="$2" fill="#faf8f4" letter-spacing="$4">SB</text>
</svg></body></html>
EOF
}

page "$DIR/_icon-large.html" 34 500 -1.5 12 45.5
page "$DIR/_icon-small.html" 38 600 -2 9 47

shot() { # $1 = html, $2 = px, $3 = outfile
	chromium --headless --disable-gpu --hide-scrollbars --default-background-color=00000000 \
		--allow-file-access-from-files --virtual-time-budget=4000 \
		--window-size="$2,$2" --screenshot="$3" "$1" 2>/dev/null
}

shot "$DIR/_icon-small.html" 16 "$OUT/favicon-16x16.png"
shot "$DIR/_icon-small.html" 32 "$OUT/favicon-32x32.png"
shot "$DIR/_icon-small.html" 48 "$OUT/icon-48.png"
shot "$DIR/_icon-large.html" 180 "$OUT/apple-touch-icon.png"
shot "$DIR/_icon-large.html" 192 "$OUT/android-chrome-192x192.png"
shot "$DIR/_icon-large.html" 512 "$OUT/android-chrome-512x512.png"
cp "$OUT/favicon-32x32.png" "$OUT/favicon.png"

# favicon.ico — a container of the three small PNGs. Written by hand because
# the ICO directory format is trivial and no image tool is installed here.
node - "$OUT" <<'JS'
const fs = require('fs');
const dir = process.argv[2];
const entries = [
  { size: 16, file: `${dir}/favicon-16x16.png` },
  { size: 32, file: `${dir}/favicon-32x32.png` },
  { size: 48, file: `${dir}/icon-48.png` }
];

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(entries.length, 4);

let offset = 6 + entries.length * 16;
const table = [];
const blobs = [];
for (const { size, file } of entries) {
  const png = fs.readFileSync(file);
  const e = Buffer.alloc(16);
  e.writeUInt8(size === 256 ? 0 : size, 0); // width
  e.writeUInt8(size === 256 ? 0 : size, 1); // height
  e.writeUInt8(0, 2); // palette size
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // colour planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += png.length;
  table.push(e);
  blobs.push(png);
}
fs.writeFileSync(`${dir}/favicon.ico`, Buffer.concat([header, ...table, ...blobs]));
console.log('favicon.ico', fs.statSync(`${dir}/favicon.ico`).size, 'bytes');
JS

ls -la "$OUT"
