---
title: 'Cloudflare Workers Telegram Bot'
date: 2024-05-15T07:11:06.679Z
tags:
  - typescript
  - cloudflare
draft: false
---

This past week I spent rewriting
[`cf-workers-telegram-bot`](https://github.com/codebam/cf-workers-telegram-bot).
Here I'm going to show you the newly updated API that anyone can use to run a
Telegram Bot on Cloudflare Workers or any other serverless platform.

First you need to set up a new Cloudflare Workers project using wrangler.

```shell
npm create cloudflare@latest
```

This will prompt you for a project name first. Choose a name for your new
project or use the default.

Next you'll be prompted for the type of application you want to deploy. You
should choose a "Hello World" Worker.

After that you'll be asked a few more questions, like if you want to use
TypeScript, and Git (optional, but recommended). You don't need to deploy just
yet.

Next you can add the token you get from `@BotFather` on Telegram as a secret so
you don't have to keep it in the code.

```shell
npx wrangler secret put TOKEN
```

Once you've created your project and created your secret you'll want to install
the `cf-workers-telegram-bot` library to start coding.

```shell
cd your-new-project
npm i @codebam/cf-workers-telegram-bot
```

This will give you access to my `TelegramBot` class for creating a Telegram Bot.

To get started you can open `src/index.ts` in your favorite editor such as
vscode or vim. Then you can import like this.

```javascript
import TelegramBot, { TelegramExecutionContext } from '@codebam/cf-workers-telegram-bot';
```

Then you can simply write your bot like this.

```javascript
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const bot = new TelegramBot(env.TOKEN);
    await bot.on('start', async function (context: TelegramExecutionContext) {
      switch (context.update_type) {
	case 'message':
	  await context.reply('Hello from Cloudflare workers');
	  break;

	default:
	  break;
      }
    }).handle(request.clone());
    return new Response('ok');
  },
};
```

Now you're ready to deploy.

```shell
npx wrangler deploy
```

You can set your webhook by going to the URL you've been given plus your token and `?command=set`.

Like this. `https://telegram-bot.username.workers.dev/YOURTOKENHERE?command=set`

Now when you send your bot a message on Telegram it should respond with `Hello from Cloudflare workers`.
