---
title: "Using X11Docker for secure GUI applications"
date: 2021-10-07T16:51:51-04:00
tags:
    - docker
    - podman
    - graphics
draft: false
---

X11Docker is a nice command line tool that allows you to run graphical
applications inside podman or docker by passing them to xpra or your wayland
socket. To do this you first need a `Containerfile` or `Dockerfile` to build an
image with the application you want to run. In this example I'm going to run
`telegram-desktop`.

```
FROM ubuntu:latest

RUN apt-get update
RUN apt-get install -y telegram-desktop

CMD ["telegram-desktop"]
```

We build this image with `podman build . -t telegram` and wait for it to
install our packages. When it's done we can simply run it with `x11docker
localhost/telegram` and it starts Telegram in Xpra.

If we wanted to start it under Wayland instead, we could run `x11docker
--wayland localhost/telegram` however the package for Telegram on Ubuntu
doesn't seem to have support for Wayland when I tried it.

This should work for any graphical software, even that which isn't in the
repositories. You can even install more than one piece of software in a single
image. Then you pass the CMD as an argument to x11docker like so `x11docker
localhost/telegram telegram-desktop`.
