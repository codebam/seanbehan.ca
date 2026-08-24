import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { d1, r2, sandbox } from "@emdash-cms/cloudflare";
import { formsPlugin } from "@emdash-cms/plugin-forms";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";

import svelte from "@astrojs/svelte";

/**
 * The admin panel is React; the site itself is plain Astro templates.
 *
 * No `fonts:` block: the two faces are subset to latin and served from
 * public/fonts, declared by @font-face in src/styles/app.css. Astro's font
 * pipeline would fetch them from Google instead, which costs a second origin
 * on the critical path and re-adds the subsets the build strips out.
 */
export default defineConfig({
    output: "server",
    adapter: cloudflare(),
    image: {
        layout: "constrained",
        responsiveStyles: true,
    },
    integrations: [react(), emdash({
        database: d1({ binding: "DB", session: "auto" }),
        storage: r2({ binding: "MEDIA" }),
        plugins: [formsPlugin()],
        sandboxRunner: sandbox(),
        marketplace: "https://marketplace.emdashcms.com",
		}), svelte()],
    vite: {
        plugins: [tailwindcss()],
    },
    devToolbar: { enabled: false },
});