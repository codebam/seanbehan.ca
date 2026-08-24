# svelte-bits

Components taken from [Svelte Bits](https://sveltebits.xyz) (MIT, David Haz) and
adapted for this site. The upstream sources live in the registry — e.g.
`https://sveltebits.xyz/r/dot-grid.json` — and this directory is the path their
own installer targets, so a future `jsrepo` install lands next to these files
rather than beside them.

Two deviations apply to every file here, and they are deliberate:

1. **No runtime dependencies.** Upstream pulls `ogl` for Grainient, `gsap` for
   DotGrid and `motion` for CountUp. This repo has shipped with no runtime
   dependencies at all, and three libraries for a hero backdrop, a dot field and
   a number is not a trade worth making. The shader, the inertia tween and the
   spring are reimplemented against the platform — the visual result is the
   upstream one, the import list is empty. The cost is that upgrading means
   re-porting rather than re-installing, which is why the deviations are written
   down here.

2. **Site tokens, not Tailwind literals.** Upstream ships dark-mode literals
   (`bg-neutral-900`, `text-white`, `#ff8a3d`). Everything here reads `--accent`,
   `--line`, `--panel` and friends from `src/app.css`, so both themes work and
   the accent stays the site's terracotta.

Everything also honours `prefers-reduced-motion`: the animated surfaces paint one
static frame and stop, and CountUp renders its final value.

| File                   | Upstream         | Used by                  |
| ---------------------- | ---------------- | ------------------------ |
| `Grainient.svelte`     | `grainient`      | Home hero backdrop       |
| `DotGrid.svelte`       | `dot-grid`       | Home facts band          |
| `CountUp.svelte`       | `count-up`       | Home facts band          |
| `SpotlightCard.svelte` | `spotlight-card` | `PostList` entries       |
| `StarBorder.svelte`    | `star-border`    | Home hero primary button |
