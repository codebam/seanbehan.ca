---
title: "Using any Linux Distribution with Flatpak"
date: 2023-05-23T13:49:32Z
tags:
    - linux
    - graphics
draft: false
---

I was using Fedora Silverblue for nearly a year before I realized I had been using Flatpak's for nearly all my software, which mind you isn't much, but I can use Firefox, Chrome, and play any video game I want using Flatpak alone so it makes sense for me.

To get this working all you need is a distribution where you can install Flatpak. I'm using Alpine Linux edge with musl and even that works. Using Flatpak allows me to use proprietary video and audio codecs in Firefox and Chrome since musl doesn't support those codecs as of right now.

If your distribution doesn't already come with FlatHub like Alpine, you'll need to [add it](https://flatpak.org/setup/).

```sh
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
```

This will allow you access to the entire Flatpak library. You can search for software using:

```sh
flatpak search steam
```

Then install using:

```sh
flatpak install com.valvesoftware.Steam
```

Make sure you periodically update your Flatpak's as well using:

```sh
flatpak update
```

For Steam to work you'll likely need to install some other Flatpak's as well, but once they're installed all your other gaming Flatpak's should "just work".

```sh
flatpak install com.valvesoftware.Steam.CompatibilityTool.Proton
```

You might also want to install your distribution's `steam-devices` package if you want to use a game controller.

```sh
sudo apt-get install steam-devices # ubuntu / debian
doas apk add steam-devices         # alpine
```

I like to give the Steam Flatpak access to my external drives so I can keep games there instead of on my hard drive. To do this I simply install Flatseal and use Flatseal to give rw (read+write) access to the directory where my drives mount to.

```sh
flatpak install com.github.tchx84.Flatseal
```

Next if you want to install Google Chrome.

```sh
flatpak install com.google.Chrome
```

That's all you have to do, then you would have Google Chrome installed.

Flatpak uses it's own runtime, remember to update all your Flatpak's periodically with `flatpak update` to avoid security vulnerabilities and other issues.