---
title: "WebSockets in Rust"
date: 2019-11-26T21:56:22-05:00
tags:
    - rust
    - websocket
    - programming
draft: false
---

Today I'll show you how you can write incredibly fast code in Rust. This is
part one of a tutorial series.

This is an intermediate tutorial, if you are unfamiliar with Rust basics I
would suggest reading the Rust book for free at [https://doc.rust-lang.org/stable/book/].

Lets dive right in.

```bash
cargo new rust-tutorial
cd rust-tutorial
```

Let's build our websocket server.

Edit your `Cargo.toml` and add [`ws`](https://docs.rs/ws/) to your
`[dependencies]`.

Your `Cargo.toml` should now look something like this.

```toml
[package]
name = "rust-tutorial"
version = "0.1.0"
authors = ["Sean Behan <codebam@riseup.net>"]
edition = "2018"

[dependencies]
ws = "*"
```

Import our libraries.

```rust
use ws::listen;
```

Start a websocket listener.

```rust
fn main() {
    listen("127.0.0.1:5000", |out| {
        move |msg: ws::Message| {
            // handle the msg here
        }
    }
}
```

We'll respond to recieved messages and just echo them back for now.

Of course you could easily pass this data into any function and use it to
generate a response. In fact the incoming and outgoing data doesn't even have
to be text.

```rust
out.send(format!("recieved message: {}", msg.into_text().unwrap())).unwrap();
out.close(ws::CloseCode::Normal)
```

If we connect to this now using websocat, which can be installed with `cargo
install websocat`, we can see the server echos back messages that we send to
it.

```sh
$ websocat ws://127.0.0.1:5000
hello world
recieved message: hello world
```

This isn't that interesting. It's cool that we can do all this in just 8 lines
of Rust though!

In the next part of this series I'll show you how to use use
[`tokio`](https://docs.rs/tokio/) to create an asyncronous server so we can
manage simultaneous connections. Stay tuned!
