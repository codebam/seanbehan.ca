---
title: "Fedora Silverblue"
date: 2021-02-13T15:21:43-05:00
tags:
    - linux
draft: false
---

Over the past few months I experimented with some new Linux distributions. Here
I'll show you the one I'm currently using and why I think it's great.

![Fedora Silverblue desktop screenshot](/img/20210213_15h31m29s_grim.png)

Fedora Silverblue is what's known as an Atomic operating system. On Fedora
Silverblue every update is checked out similar to how git checks out a new
reference. If you want to install packages into the base image you can use
rpm-ostree install like you usually would, the only difference is that you need
to reboot to boot into your new base system reference.

If you don't want to reboot there is a better way though. Instead of layering
packages into your base image you can use a tool called toolbox which is simply
a wrapper around podman for creating containers with the current Fedora image.
You can use toolbox enter and install and run any software as well as access
files inside your home directory.

If at some point you do updates and your system doesn't boot, you don't have to
worry. You can simply reboot and choose the last working base image and your
system will boot up as normal, allowing you to fix any breakage.

Silverblue is so much more powerful than that though. You can rebase your
entire system on different base images or Fedora versions. Now instead of
installing your new desktop environment and risk breaking your operating system
you can do an `rpm-ostree rebase` and rebase on another desktop environment. I
used this to rebase on an image from
[Kinoite](https://fcos.siosm.fr/kinoite/refs/heads/fedora/33/x86_64/) called
base which just includes all the base packages and no desktop environment. Then
I installed my window manager of choice and it's dependencies. Now I have a
fully modular Fedora installation along with [Sway](https://swaywm.org/) and
all the dependencies I need to use it.
