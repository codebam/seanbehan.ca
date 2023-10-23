---
title: "Alpine Linux LBU"
date: 2020-12-03T22:09:46-05:00
tags:
    - linux
    - alpine
draft: false
---

Alpine Linux has a cool feature called LBU that lets you create a backup on top
of the Live ISO. These backups are called local backups.

I plan on using LBU as a system maintenance drive. It allows you to save
changes you make to the Live ISO and restore them automatically when you boot
the next time.

To set up LBU I booted the Alpine Linux ISO, ran `setup-alpine`, mounted my
drive to `/media/alpine_usb` and when I got to the disk selection I selected no
disk, and `alpine_usb` as where to store the configs, and the default for
cache.

Now when I make changes in the Alpine Linux Live ISO I can commit them.

To see what is being committed I first check `lbu status` which lists all the
files being added or removed, then `lbu commit` to commit the changes.

When I was rebooting I had an issue where the drive would automount itself to
/media/sdb and then wouldn't work with lbu when I wanted to commit or check the
status because it was already mounted. To fix this I just had to `umount
/dev/sdb` on boot and then lbu worked as expected.

To use cache you have to mount it to `/media/alpine_usb` so that it can write
the cache files when you're installing packages. I want this because it makes
reinstalling my packages on reboot a lot faster, they can just be loaded from
cache instead of from online repositories.

Upon reboot I had to reinstall all the packages I had installed using `apk
upgrade` but since the cache is there it just installs everything really
quickly.

I uncommented and changed the number of backups in `/etc/lbu/lbu.conf` to 20 so
that I would be able to revert up to 20 commits in case I broke my configs.

I see Alpine LBU as a good way to keep a backup of changes to the ISO so it
could be used as a system recovery disk with the tools that are needed.
