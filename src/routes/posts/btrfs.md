---
title: "BTRFS RAID1 and how to fix it"
date: 2023-05-23T14:39:58Z
tags:
    - linux
    - backup
    - raid
draft: false
---

I mentioned in my previous post that I use an external drive to keep my Steam
games on. In an attempt to not have to re-download hundreds of gigabytes of
games I keep them on a RAID1 with 2x5TB drives that I use BTRFS to manage. In
this post I'm going to outline how I set it all up, and how I manage it when
issues arise.

First of all I had to format the drives, so I made sure they were empty and
everything was backed up. Don't do this unless you know for sure that all the
data on all your drives is backed up somewhere else, or you want to delete it
permanently.

Okay so the commands are easy, you just have to make sure you're using the
right ones as not to lose your data. Don't run these commands without
understanding what they do. Replace _ with your drive letter. A lot of these
commands need to be run with root, make sure to either elevate to root (`sudo -s`)
or prepend the commands with `sudo`.

```sh
lsblk
```

```sh
mkfs.btrfs /dev/sd_1
mkfs.btrfs /dev/sd_1
```

Now you can mount the newly formatted drives to a single RAID1.

```sh
mount /dev/sd_1 /mnt
btrfs device add /dev/sd_1 /mnt
btrfs balance start -dconvert=raid1 -mconvert=raid1 /mnt
```

The last command might take a little bit of time, but once it's finished your
drives will be all ready to be used.

Now if you need to swap out a drive, add another, or you unplug one when it's
writing you can simply balance again and btrfs should be able to balance back
onto the drive. 

```sh
btrfs balance start -dconvert=raid1 -mconvert=raid1 /mnt
```

You can view the status of the balance using:

```sh
btrfs balance status
```

You can remove a drive or add another using:

```sh
btrfs device remove /dev/sd_1
btrfs device add /dev/sd_1
```

Just make sure you balance right afterwards (which will take a VERY long time
if you have lots of data, beware)

```sh
btrfs balance start -dconvert=raid1 -mconvert=raid1 /mnt
```