---
title: "Podman crun and cgroups v2"
date: 2021-09-18T23:09:02-04:00
tags:
    - linux
    - docker
    - podman
draft: false
---

Podman[^1] is a container management software similar to Docker that can run
OCI containers as regular users (not root) by using container management
libraries such as crun or runc, and cgroups v1 or v2. It can be used as a
drop-in replacement for Docker and supports docker-compose using
podman-compose.

Unfortunately for some distributions after installing podman the operating
system defaults to cgroups v1 and runc, not cgroups v2 and crun. As was the
case on Rocky Linux for me.

First we can switch to crun instead of runc by installing crun with our package
manager. It was already installed for me, but on Fedora you would use `sudo dnf
install crun`

Then you can edit the file `/usr/share/containers/containers.conf` and change
the line `runtime = "runc"` to `runtime = "crun"`. Now you can verify that
you're using crun with `podman info | grep crun`.

```
name: crun
package: crun-0.20.1-1.module+el8.4.0+643+525e162a.x86_64
path: /usr/bin/crun
  crun version 0.20.1
```

Now the harder part was enabling cgroups v2. Luckily I found a
[comment](https://github.com/containers/podman/issues/9410#issuecomment-785840320)
on a GitHub issue outlining the steps you need to complete to get cgroups v2 to
work.

First we can enable it in the kernel with

```
sudo grubby --update-kernel=ALL --args="systemd.unified_cgroup_hierarchy=1"
```

Then we can enable linger. This will also allow our containers to remain
running after logging out.

```
sudo loginctl enable-linger codebam
```

Then the last step which made everything work for me is to set the
`pid_limit=0`. For me it was in `/usr/share/containers/containers.conf` instead
of `/etc/containers/`.

Now you can reboot. `podman info | grep cgroup` should say

```
cgroupControllers: []
cgroupManager: systemd
cgroupVersion: v2
```

Now we're using cgroups v2 and crun.

[^1]: https://podman.io
