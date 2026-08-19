"""Compute @font-face fallback metrics for the two webfonts.

A webfont with `font-display: swap` paints in a fallback first, then reflows
when it arrives. Declaring a fallback @font-face whose metrics are overridden
to match the real face removes the reflow: the fallback is drawn at the size
and line box the webfont will occupy.

The overrides are printed as the CSS to paste into app.css. Values follow the
same formula fontaine and next/font use:

    size-adjust     = webfont avg char width / fallback avg char width
    ascent-override = webfont ascender / (upm * size-adjust)

Fallbacks are measured from Liberation Sans and Liberation Serif, which are
metric-compatible with Arial and Times New Roman — the faces the CSS actually
names. Needs fonttools and brotli:

    nix-shell -p "python3.withPackages(ps: [ps.fonttools ps.brotli])" \
      --run "python3 tools/fonts/fallback-metrics.py"
"""

import pathlib
import subprocess
from fontTools.ttLib import TTFont
from fontTools.ttLib.woff2 import decompress

ROOT = pathlib.Path(__file__).resolve().parents[2]
TMP = pathlib.Path('/tmp/seanbehan-fallback-metrics')

# The faces the site serves, and the local family each falls back to.
PAIRS = [
    ('Inter Variable', ROOT / 'static/fonts/inter-latin.woff2', 'Liberation Sans', 'Arial'),
    ('Newsreader Variable', ROOT / 'static/fonts/newsreader-latin.woff2', 'Liberation Serif', 'Times New Roman'),
]


def local_path(family: str) -> pathlib.Path:
    out = subprocess.run(['fc-match', '-f', '%{file}', family], capture_output=True, text=True)
    return pathlib.Path(out.stdout.strip())


def metrics(path: pathlib.Path) -> dict:
    if path.suffix == '.woff2':
        TMP.mkdir(exist_ok=True)
        ttf = TMP / (path.stem + '.ttf')
        if not ttf.exists():
            decompress(str(path), str(ttf))
        path = ttf

    font = TTFont(str(path))
    head, hhea, os2 = font['head'], font['hhea'], font['OS/2']
    return {
        'upm': head.unitsPerEm,
        'ascent': hhea.ascender,
        'descent': abs(hhea.descender),
        'line_gap': hhea.lineGap,
        'avg_width': os2.xAvgCharWidth,
    }


for family, file, fallback_family, css_family in PAIRS:
    web = metrics(file)
    local = metrics(local_path(fallback_family))

    size_adjust = (web['avg_width'] / web['upm']) / (local['avg_width'] / local['upm'])
    scale = web['upm'] * size_adjust

    print(f"""@font-face {{
	font-family: '{family} Fallback';
	src: local('{css_family}');
	size-adjust: {size_adjust * 100:.2f}%;
	ascent-override: {web['ascent'] / scale * 100:.2f}%;
	descent-override: {web['descent'] / scale * 100:.2f}%;
	line-gap-override: {web['line_gap'] / scale * 100:.2f}%;
}}""")
