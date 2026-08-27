"""Trace the favicon lettering to SVG paths.

The icon is Newsreader "SB" in pale grey on the blue accent. Referencing the font
by name in an SVG only works on machines that have Newsreader installed, so
the glyphs are converted to outlines here: decompress the woff2, pin the
variable font at the weight the icon uses, then walk each glyph with a pen.

Output is a self-contained favicon.svg with no font dependency.
"""

import pathlib
from fontTools.ttLib import TTFont
from fontTools.ttLib.woff2 import decompress
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform

D = pathlib.Path(__file__).parent
WOFF2 = pathlib.Path(
    '/home/codebam/Documents/git/seanbehan.ca/node_modules/@fontsource-variable/'
    'newsreader/files/newsreader-latin-standard-normal.woff2'
)

# Matches the tuned small-size variant the PNGs are rendered from:
# weight 600, font-size 38 in a 64-unit box, letter-spacing -2.
WEIGHT = 600
FONT_SIZE = 38
TRACKING = -2.0
BASELINE = 47.0
RADIUS = 9
TEXT = 'SB'
BLUE = '#2563eb'
GREY = '#f7f8fa'

ttf = D / '_newsreader.ttf'
if not ttf.exists():
    decompress(str(WOFF2), str(ttf))

font = TTFont(str(ttf))
# Newsreader varies on weight and optical size; pin opsz to the display end so
# the outlines match how the browser renders the icon at large sizes.
axes = {a.axisTag: (a.minValue, a.defaultValue, a.maxValue) for a in font['fvar'].axes}
pins = {'wght': WEIGHT}
if 'opsz' in axes:
    pins['opsz'] = axes['opsz'][2]
font = instantiateVariableFont(font, pins, inplace=True, updateFontNames=False)

glyphs = font.getGlyphSet()
cmap = font.getBestCmap()
upem = font['head'].unitsPerEm
scale = FONT_SIZE / upem

# Advance widths, plus the tracking the CSS version applies between glyphs.
names = [cmap[ord(ch)] for ch in TEXT]
advances = [glyphs[n].width * scale for n in names]
total = sum(advances) + TRACKING * (len(names) - 1)

# text-anchor="middle" in a 64-wide box
x = 32 - total / 2
paths = []
for name, adv in zip(names, advances):
    # Flip the y axis: font units go up from the baseline, SVG user units go down.
    pen = SVGPathPen(glyphs, ntos=lambda v: f'{v:.2f}')
    glyphs[name].draw(TransformPen(pen, Transform(scale, 0, 0, -scale, x, BASELINE)))
    d = pen.getCommands()
    if d:
        paths.append(d)
    x += adv + TRACKING

svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="{RADIUS}" fill="{BLUE}"/>
  <path fill="{GREY}" d="{' '.join(paths)}"/>
</svg>
"""

out = D / 'out' / 'favicon.svg'
out.parent.mkdir(exist_ok=True)
out.write_text(svg)
print('wrote', out, len(svg), 'bytes')
