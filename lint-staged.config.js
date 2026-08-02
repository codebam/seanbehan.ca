// Tasks the pre-commit hook runs over staged files. See .githooks/pre-commit.
//
// This lives in its own file rather than package.json because svelte-check
// needs the function form below.
//
// The hook invokes lint-staged with `--concurrent false`, so these run in the
// order written, one at a time. That matters: lint-staged is concurrent by
// default, which would let Prettier rewrite a file while svelte-check is
// reading it.
export default {
	// ESLint first, so Prettier gets the last word on formatting.
	'*.{js,ts,svelte}': ['eslint --fix --no-warn-ignored', 'prettier --write'],

	// Everything else Prettier understands. --ignore-unknown skips extensions
	// it has no parser for (.webp, .ico, extensionless files).
	'!(*.{js,ts,svelte})': 'prettier --write --ignore-unknown',

	// svelte-check type-checks the whole project at once — it has no per-file
	// mode — so the function form throws away the matched filenames and returns
	// a single command. The glob only decides *whether* it runs: no point
	// type-checking a commit that only touches Markdown or images.
	//
	// Because it is whole-project, a type error anywhere will block the commit,
	// even in a file you didn't touch. That is the one place this hook departs
	// from "staged files only". Run `npm run check` to see the full list.
	//
	// It runs last, after the fixers, so it checks final content. lint-staged
	// has stashed unstaged changes by this point, so the working tree it reads
	// is exactly what's about to be committed.
	'*.{js,ts,svelte,json}': () => 'npm run check'
};
