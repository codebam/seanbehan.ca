---
title: "Podman Auto Updating Systemd Services"
date: 2021-09-23T10:34:43-04:00
tags:
    - linux
    - docker
    - podman
draft: false
---

Podman[^1] has a nice feature called `generate` that lets you generate
different kinds of configuration files for starting pods. One that I use often
is `podman generate systemd` which generates a new user service that can be
started with `systemctl --user start container-yourcontainer.service` or
enabled.

If you want your container to auto update you can simply pass it the flag
`--label "io.containers.autoupdate=registry"` when you're creating it. The
systemd service will automatically pull the latest versions of containers
before starting them. You can manually update your container images now using
`podman auto-update`.

If you want to update your images on a schedule you can enable the
`podman-auto-update.timer` using `systemctl --user enable --now
podman-auto-update.timer` which will auto update your containers every Monday
morning.[^2]

You can also generate a Kubernetes YAML configurations using `podman generate
kube`. This can then be loaded in Kubernetes to run your containers.

[^1]: https://podman.io
[^2]: https://fedoramagazine.org/auto-updating-podman-containers-with-systemd/
