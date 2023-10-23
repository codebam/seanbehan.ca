---
title: "Using Llama2 on Cloudflare Workers"
date: 2023-10-12T14:21:27-04:00
draft: false
---

You might know I've made a Chat Bot
[cf-workers-telegram-bot](https://github.com/codebam/cf-workers-telegram-bot).
Recently I added AI to it using Cloudflare AI. Here I'm going to show you how
and how you too can make your own chatbot using Cloudflare AI.

First you'll want to add the AI section to your wrangler.toml.

```toml
[ai]
binding = "AI"
```

Then you can simply import

```javascript
import { Ai } from "@cloudflare/ai";
```

And you can use it like this

```javascript
const ai = new Ai(env.AI);
prompt = 'hello world';
const result = await ai.run("@cf/meta/llama-2-7b-chat-int8", {
    prompt,
});
```

That's it!

There are other models you can use as well on Cloudflare AI so you should check
them out here for other cool things you can do
https://developers.cloudflare.com/workers-ai/models/

I'm hoping for a 70B model soon :)

If you want to use this to make a chat bot make sure when you restore the
prompt you wrap user input in `[INST] [/INST]` tags so llama2 knows what was
user input and what it said.

If you want to try out my Chat Bot it's on [Telegram](https://t.me/TuxRobot).
