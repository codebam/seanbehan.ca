# Content repairs for D1

The audit found five content defects that live in D1, not in this repo: most
imported posts break every hard-wrapped source line into its own paragraph, the
newest post's only image is an inline base64 with empty alt text, the remaining
body images have no dimensions, the two newest posts are thin announcements, and
two older posts have small editorial defects. This page is the runbook for the
mechanical half of that list and the record of what a human still has to write.

The tool is `scripts/repair-post-paragraphs.mjs`. It is dry-run by default;
nothing writes without `--apply`. A local write needs an explicit
`--db <copy.sqlite>`, and it refuses the known production paths
(`.wrangler/**`, `data.db`, the main checkout's D1 snapshot) by name. The
production path is a separate, explicit operator mode, `--remote --url <origin>
--apply`, because that one goes through the CMS API and creates revisions.

```bash
# Rehearse on a copy, never on the main checkout.
cp /home/codebam/Documents/git/seanbehan.ca/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/e7352547963de7050bd7d94658afc4fe78b61811b7815da12d90be8e863abf4d.sqlite /tmp/d1-copy.sqlite
node scripts/repair-post-paragraphs.mjs --db /tmp/d1-copy.sqlite
node --test scripts/repair-post-paragraphs.test.mjs
```

The dry run prints one line per post (`blocks 35 -> 20 (15 merges)`) and a
sample joined sentence, so the punctuation heuristic can be reviewed before it
is applied. The local acceptance run reaches 18 posts and 271 real prose merges
on the August snapshot, and the summary names the two boundaries it declined:
`271 soft-wrap merges (2 reference-definition boundaries declined)`. The
audit's 273 boundary count had included two `[^1]: https://...` pairs, which
are single-line definitions rather than soft-wrapped prose.

One limitation to review: the merge rule reads block text, not the blank lines
the importer dropped, so a paragraph ending on a URL, an emoticon, a code span
or a colon can be mistaken for a soft wrap. The dry run prints one sample per
post; when a post matters, `--only <slug>` narrows a run to it and the repaired
body can be read in the admin before the next apply. A wrong join is words
glued together, not words changed or deleted; splitting the paragraph in the
admin repairs it.

## C1 - repair the imported paragraphs

### What happened

`scripts/import-markdown.mjs` handed the raw hard-wrapped markdown to
`emdash content create`, and EmDash's markdown converter reads every single
newline as a block break. A source line such as

```text
I mentioned in my previous post that I use an external drive to keep my Steam
games on. In an attempt to not have to re-download hundreds of gigabytes of
```

became three sibling `<p>` blocks, each carrying a paragraph margin.

### What was changed

- The repair script exports `unwrapSoftBreaks(markdown)`, which collapses
  single newlines inside prose into spaces while copying blank lines, fenced
  code, headings, lists, blockquotes, tables and indented code through
  untouched.
- `scripts/import-markdown.mjs` now calls it before `content: post.body`, so a
  future import of the legacy files cannot recreate the split paragraphs.
- The same script merges the already-stored `_type: 'block'` blocks with
  `style: 'normal'` in D1. It merges when the previous block does not finish
  on `.!?`, or when the next starts lowercase or with a parenthesis; marks,
  links, code and reference definitions are preserved as blocks.

Reading time, excerpts and search all read words, not blocks, so the merge
should not change counts. The reader lane still has to re-run its PostList
excerpt and reading-time tests once the repair is live.

### Run it locally

```bash
node scripts/repair-post-paragraphs.mjs --db /tmp/d1-copy.sqlite           # dry run
node scripts/repair-post-paragraphs.mjs --db /tmp/d1-copy.sqlite --apply   # write the copy
node scripts/repair-post-paragraphs.mjs --db /tmp/d1-copy.sqlite           # expect 0 merges
```

`--apply` writes `ec_posts.content` in one transaction. It does not create
revisions or touch `updated_at`; the production path below does both, because
it writes through `emdash content update`.

### Run it in production

Back up first. `wrangler d1 export` refuses this database because EmDash builds
FTS5 virtual tables, so use the repo's own exporter, which asks D1 for the real
table list and skips the derived ones:

```bash
node scripts/backup-d1.mjs seanbehan-ca /tmp/emdash-$(date +%F).sql
npx emdash login --url https://seanbehan.ca
```

Then rehearse against production (read-only) and only afterwards write:

```bash
node scripts/repair-post-paragraphs.mjs --remote --url https://seanbehan.ca
node scripts/repair-post-paragraphs.mjs --remote --url https://seanbehan.ca --apply
```

Remote mode lists published posts, reads each one with
`emdash content get posts <id> --raw --published`, merges in memory, and writes
with `emdash content update posts <id> --rev <rev>`, so `_rev` conflict
detection, revisions, FTS maintenance and cache invalidation stay in the CMS's
hands. It processes published posts only; drafts are left alone.

Verify after the run (the shared cache may hold the old body for up to its
ten-minute window, so an immediate HIT can be stale):

```bash
curl -s https://seanbehan.ca/posts/btrfs | grep -c '<p>I mentioned in my previous post[^<]*games on'
curl -s https://seanbehan.ca/posts/nixos-uki.md | grep -c 'flake that might help you in the case'
curl -s https://seanbehan.ca/rss.xml | grep -c 'keep my Steam games on'
```

Each should be `1`. Btrfs, NixOS UKI and Svelte Auth are the three posts the
audit used as the visible checks. The same body is what HTML, RSS, `.md` and
`.json` render from, so a repair that shows in one should show in all four.

## C2 - the DDoS post's inline base64 image

Slug: `how-i-survived-a-ddos-flood`. Its only image is a bare `alt`, 13 KB
`data:image/png;base64,...` inside the Portable Text. Uploading it and writing
real alt text is a content decision, so the tool does not invent either. It
can extract the bytes:

```bash
node scripts/repair-post-paragraphs.mjs --remote --url https://seanbehan.ca \
  --extract-image how-i-survived-a-ddos-flood --out /tmp/ddos.png
```

`--extract-image` is read-only and writes only the named output file. Then:

1. Run `npx emdash media upload /tmp/ddos.png --alt "<what the screenshot shows>" --url https://seanbehan.ca`.
   The alt text must describe what is actually in the screenshot; do not paste
   a generic label.
2. In the admin body editor, replace the inline image block with the uploaded
   asset, keeping the screenshot's intrinsic `width`/`height` (the media record
   carries them) and the alt text from step 1.
3. Keep the post's prose as it is unless the operator chooses to expand it
   under C4; the screenshot and its alt are the required fix here.

Acceptance for this item: the live HTML contains no `data:image`, and the
`<img>` has a non-empty `alt` plus integer `width`/`height`. Until reader lane
R2 lands, RSS carries no body image at all; until R3 lands, the `.md`/`.json`
export corrupts `data:` URLs into `https://seanbehan.cadata:...`; both are
fixed in that lane, not here.

## C3 - dimensions and variants for the other body images

Slug `silverblue` carries `/img/20210213_15h31m29s_grim.webp` (2560x1440,
209,422 B); slug `react-card` carries `/img/reactjs-card.webp` (843x381,
5,478 B). Neither block stored dimensions, so the reader shifted as the image
loaded.

`--images` adds the two known intrinsic sizes on a copy:

```bash
node scripts/repair-post-paragraphs.mjs --db /tmp/d1-copy.sqlite --images         # 2 blocks reported
node scripts/repair-post-paragraphs.mjs --db /tmp/d1-copy.sqlite --images --apply # 2 blocks written
```

For the 2560px screenshot, the operator should also make 800/1200/1600px WebP
derivatives under `public/img/` (or the R2 equivalent) and put their public
paths in a manifest; the script never guesses derivative URLs. The manifest is
a JSON object from the original asset URL to the variants array:

```json
{
	"/img/20210213_15h31m29s_grim.webp": [
		{ "url": "/img/20210213_15h31m29s_grim-800.webp", "width": 800, "height": 450 },
		{ "url": "/img/20210213_15h31m29s_grim-1200.webp", "width": 1200, "height": 675 },
		{ "url": "/img/20210213_15h31m29s_grim-1600.webp", "width": 1600, "height": 900 }
	]
}
```

```bash
node scripts/repair-post-paragraphs.mjs --db /tmp/d1-copy.sqlite \
  --images --variants /tmp/variants.json
node scripts/repair-post-paragraphs.mjs --db /tmp/d1-copy.sqlite \
  --images --variants /tmp/variants.json --apply
```

Each image block ends up as `{ asset: { url }, alt, width, height, variants? }`,
where every variant is `{ url, width, height? }`. Reader lane R4 should emit
`srcset` candidates as `<url> <width>w` from that array and `width`/`height` as
integers on the `<img>`; that contract is the only cross-lane coupling in this
workstream. Until R4 lands and the derivatives exist, the live tags keep their
old shape; `--images` only changes the database copy.

Acceptance: the dry run reports exactly two image blocks on the snapshot copy;
after R4 deploys, the React and Silverblue `<img>` tags carry integer
`width`/`height`, and Silverblue carries `srcset`/`sizes` once the manifest has
been applied.

## C4 - the two newest posts (operator copy)

Both are D1 content decisions; no replacement prose is stored in this repo.

- `how-i-survived-a-ddos-flood` is ~51 words plus the screenshot. Either expand
  it into an incident note (traffic type and volume, what Cloudflare absorbed,
  the configuration that mattered, lessons learned) or publish a substantive
  follow-up so the archive lead is a real post. If it stays a short note, label
  it as a note so the archive is honest about what the top row is.
- `emdash-and-cloudflare-workers` says EmDash is "made by Cloudflare". The
  project is `emdash-cms/emdash`, built on Astro for Cloudflare Workers.
  Correct that sentence to "built on Astro and Cloudflare Workers" or "for
  Cloudflare Workers"; the exact wording is the operator's.

Acceptance: the top of `/posts` shows a substantive post or an explicit note
label, and the EmDash post no longer says "made by Cloudflare".

## C5 - the two small content defects (operator edit)

- `nixos-uki`: delete the empty `### Building` heading immediately before
  `### Building the Image`. The contents list is generated from body headings,
  so the `#building` entry disappears with it.
- `websockets-rust`: the 2019 post still closes by promising a next part that
  never shipped. Either publish part two or add a short editor's note with
  current async/current-crate guidance and a link to a modern successor. The
  note's wording is an operator decision.

Acceptance: the `nixos-uki` TOC has no `#building` entry, and
`websockets-rust` no longer ends on an unqualified promise.

## Safety notes

- Run the local commands against `/tmp` copies only. `--apply` refuses paths
  under `.wrangler`, `data.db`, `metadata.sqlite` and the known snapshot name
  wherever it is copied.
- `--remote` needs an explicit `--url`, and `--apply` is a separate flag;
  `--remote` alone is a read-only rehearsal.
- The production backup is the rollback source. If a repair needs to be undone,
  restore from that SQL file (or D1 Time Travel) rather than running the tool in
  reverse; the tool only merges forward.
- No alt text, incident detail, part-two copy or personal history is generated
  by these scripts. Those are content decisions for the operator.
