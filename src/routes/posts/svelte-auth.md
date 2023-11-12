---
title: "Auth and Databases in Sveltekit"
date: 2023-11-12T05:40:33.821Z
tags:
    - svelte
    - sveltekit
    - javascript
    - typescript
    - serverless
    - cloudflare
draft: false
---

Recently I implemented HTTP Basic Auth using a session cookie in SvelteKit on
Cloudflare Pages using Cloudflare D1 as a database backend. Here I'll show some
code snippets so you can do the same.

First you would want to set up your project according to
[this](https://developers.cloudflare.com/pages/framework-guides/deploy-a-svelte-site).
So you can have a basic project set up.

Next you'll want to add the database to your project. It's easy to create using
wrangler. Just remember to link it to your project in your cloudflare dash
under settings > functions.

```sh
wrangler d1 create your-database-name
```

Then you can copy it into your
[`wrangler.toml`](https://github.com/codebam/svelte-auth/blob/master/wrangler.toml)
so your local dev works with it. To run with support for D1 you can use this
oneliner.

```sh
npm run build && wrangler pages dev .svelte-kit/cloudflare
```

My final schema looks like this. Yours might be a bit different, but mine
allows for adding songs to a playlist which will be the purpose of my
[website](https://music.seanbehan.ca).

```sql
CREATE TABLE IF NOT EXISTS Users (id TEXT PRIMARY KEY, password TEXT);
CREATE TABLE IF NOT EXISTS Playlist (id TEXT PRIMARY KEY, email TEXT, url TEXT, date TEXT);
```

You'll want to create these tables using wrangler both locally (on your dev
server) and remotely.

```sh
wrangler d1 execute svelte-auth --local --file=./schema.sql
wrangler d1 execute svelte-auth --file=./schema.sql
```

Now you can add it to your
[`app.d.ts`](https://github.com/codebam/svelte-auth/blob/master/src/app.d.ts)
like this.

```typescript
declare global {
	namespace App {
		interface Platform {
			env?: {
				DB: D1Database;
			};
			context: {
				waitUntil(promise: Promise<any>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
```

Now you're ready to set up authentication. It's probably easier to just show
you how I did it. I imported `sha256` which is just a simple function I wrote
to call web crypto to get the sha256sum of a string.
[Here](https://github.com/codebam/svelte-auth/blob/master/src/routes/login/%2Bpage.server.ts)
is my code.

I added [form actions](https://kit.svelte.dev/docs/form-actions). These
allow you to quickly write code that will work with HTML `<form>`'s.

```typescript
import { redirect } from '@sveltejs/kit';
import sha256 from '$lib/sha256';

export const actions = {
	register: async (event) => {
		const data = await event.request.formData();
		const email = data.get('email');
		const password = await sha256(data.get('password')?.toString() ?? '');
		const { success } = await event.platform?.env?.DB.prepare('INSERT INTO Users VALUES (?, ?)')
			.bind(email, password)
			.all();
		if (success) {
			event.cookies.set('session', JSON.stringify({ email, password }));
			throw redirect(303, '/');
		}
	},
	login: async (event) => {
		const data = await event.request.formData();
		const email = data.get('email');
		const password = await sha256(data.get('password')?.toString() ?? '');
		const results = await event.platform?.env?.DB.prepare('SELECT password FROM Users WHERE id=?')
			.bind(email)
			.all();
		if (results.results[0].password === password) {
			event.cookies.set('session', JSON.stringify({ email, password }));
			throw redirect(303, '/');
		}
	}
};
```

Now this is enough to save a cookie with the user auth, but to re-auth on a
page we need to check if their cookie is valid. So how I do this is I wrote
another function called
[`tryLogin.ts`](https://github.com/codebam/svelte-auth/blob/master/src/lib/tryLogin.ts).

```typescript
import type { D1Database } from '@cloudflare/workers-types';

const tryLogin = async (session_cookie: string | undefined, DB: D1Database) => {
	if (session_cookie) {
		const { email, password } = JSON.parse(session_cookie);
		const results = await DB.prepare('SELECT password FROM Users WHERE id=?').bind(email).all();
		if (results.results[0].password === password) {
			return true;
		}
	}
	return false;
};

export default tryLogin;
```

Now I can call this inside
[`+page.server.ts`](https://github.com/codebam/svelte-auth/blob/master/src/routes/%2Bpage.server.ts).

```typescript
import tryLogin from '$lib/tryLogin';
import getCurrentSong from '$lib/getCurrentSong';

export const load = async (event) => ({
	auth: await tryLogin(event.cookies.get('session'), event.platform?.env?.DB),
	song: await getCurrentSong(event.platform?.env?.DB)
});
```

Using it inside the
[`+page.svelte`](https://github.com/codebam/svelte-auth/blob/master/src/routes/%2Bpage.svelte)
is as simple as this one line.

```
export let data: {auth: boolean, song: {id: string, url: string}};
```

Now I wrote more form actions for adding and removing songs from the playlist
[here](https://github.com/codebam/svelte-auth/blob/master/src/routes/playlist/%2Bpage.server.ts).

```typescript
import { redirect } from '@sveltejs/kit';
import tryLogin from '$lib/tryLogin';

export const actions = {
	add: async (event) => {
		if (await tryLogin(event.cookies.get('session'), event.platform?.env?.DB)) {
			const session = JSON.parse(event.cookies.get('session'));
			const email = session.email;
			const formdata = await event.request.formData();
			const v = new URL(formdata.get('url')).searchParams.get('v');
			await event.platform?.env?.DB.prepare('INSERT INTO Playlist VALUES (?, ?, ?, ?)')
				.bind(crypto.randomUUID(), email, v, Math.floor(new Date().getTime()))
				.all();
		}
		throw redirect(303, '/');
	},
	remove: async (event) => {
		if (await tryLogin(event.cookies.get('session'), event.platform?.env?.DB)) {
			const formdata = await event.request.formData();
			const id = formdata.get('id');
			await event.platform?.env?.DB.prepare('DELETE FROM Playlist WHERE id=?').bind(id).all();
		}
		throw redirect(303, '/');
	}
};
```

Now this allows us to add songs, we just need the interface for it. So I wrote
the [main page](https://github.com/codebam/svelte-auth/blob/master/src/routes/%2Bpage.svelte)
to allow logged in users to submit songs.

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import YouTube from '$lib/svelte-youtube.svelte';
  export let data: {auth: boolean, song: {id: string, url: string}};
</script>

{#if !data.auth}
<p>Visit <a href="/login">login</a></p>
{/if}

<YouTube on:end={() => document.getElementById('remove_song')?.click()} videoId={data.song.url} options={{playerVars: { autoplay: 1 }}} />

<form style="display: none;" method="POST" action="/playlist?/remove" use:enhance>
  <input name="id" value="{data.song.id}">
  <button id="remove_song">remove</button>
</form>

{#if data.auth}
  <form method="POST" action="/playlist?/add" use:enhance>
    <label>Submit a song
      <input name="url" type="url" placeholder="paste a youtube link" pattern=".*v=.*">
    </label>
    <button>Submit</button>
  </form>
  <p><a href="/logout">Log out</a></p>
{/if}
```

If you have any problems or you want to see the entire repo. The code is
[here](https://github.com/codebam/svelte-auth) and the live demo is
[here](https://music.seanbehan.ca).
