---
title: "Using Ostree for file snapshots"
date: 2023-05-27T11:47:26Z
tags:
    - linux
    - backup
    - ostree
draft: false
---

Ostree is the software that allows rpm-ostree in Fedora Silverblue to keep snapshots of previous deployments and do incremental updates, but did you know it can also be used to keep snapshots of your own files? It's actually quite easy once it's all set up.

For this I would strongly suggest you use root for your ostree. Although you can use it without, you will be able to use files that regular users can't use such as hardlinks if you're root, which will speed up incremental snapshots very much.

First you'll want to create your inital ostree. Do this in a new folder, on a drive with lots of free space for the files you want to snapshot. You'll need as much free space as all the files you want to snapshot.

```sh
mkdir tree
sudo ostree init --repo=tree
```

Next you can start committing files to your new tree. Be sure to check the man pages for `ostree-commit` and `ostree-init`.

```sh
sudo ostree commit --repo=tree --branch=master $PWD/dir
```

Keep in mind you cannot commit individual files, only entire directories at a time. Now when you change something inside `/dir` you can commit again with the exact same command and you will have both copies in your ostree. To restore the original copy you can then use `ostree-checkout`.

```sh
ostree refs --repo=tree master
```

This will show you a list of all your commits. Now choose the one you want to restore.

```sh
ostree checkout --repo=tree --union your-commit-sha dir
```

Make sure you check `ostree -h` for a list of ostree commands and read each of their man pages if you want to use them fully.

I use this on a filesystem that is already a RAID1. Make sure you keep proper backups, ostree can create snapshots but it won't help you if your entire drive fails.