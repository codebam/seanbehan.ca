#!/usr/bin/env node
/**
 * Remove the `.dev.vars` copy the Cloudflare adapter leaves in `dist/server`.
 *
 * `astro build` copies the working tree's `.dev.vars` beside the server entry
 * so `wrangler dev` can read local secrets from the build output. A real
 * deploy gets its secrets from `wrangler secret put`, and the production build
 * runs on CI where `.dev.vars` does not exist — but a local or operator deploy
 * would otherwise hand `wrangler deploy` a directory containing a plaintext
 * secret file. Removing it is the last step between the build and the upload.
 */

import { rm } from 'node:fs/promises';

const target = new URL('../dist/server/.dev.vars', import.meta.url);
await rm(target, { force: true });
console.log('stripped dist/server/.dev.vars before deploy');
