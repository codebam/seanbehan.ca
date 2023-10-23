---
title: "2FA Everything"
date: 2020-12-03T20:38:10-05:00
tags:
    - security
    - linux
draft: false
---

I'll start this post by saying one thing. Are you SURE you want to wipe that
yubikey? I spent the last 2 weeks redoing my entire password manager. Silly me
forgot that I had my passwords encrypted using the yubikey I wiped to create
new PGP keys.

Anyways over the past week or two I moved all my passwords from
[pass](https://www.passwordstore.org/) into [keepass](https://keepass.info/)
and then back into pass when keepass didn't meet all my needs for a password
manager. KeePass supported using yubikeys for decryption, but not more than one
at a time. If I were to lose the key I would get permanently locked out.

Features I want in my password manager:

* 2FA for password manager decryption
* Mobile and desktop apps
* Secure encryption

What I settled on was this. I bought myself a [Yubikey 5C
NFC](https://www.yubico.com/ca/product/yubikey-5c-nfc/) to go alongside my
previous [Yubikey 5C](https://www.yubico.com/ca/product/yubikey-5c/). There
might be better alternatives, but this is the one I purchased. This one had NFC
and was convenient for accessing passwords on my phone and laptop.

To generate my PGP keys I actually generated them on the Yubikey itself, this
way the private key never touches the laptop I used to generate the key.

```
$ gpg --card-edit
gpg/card> admin
gpg/card> key-attr
gpg/card> generate
```

The `key-attr` command lets you choose the type and size of key you're
generating on the device. I used RSA 4096 for my Yubikey 5C and ed25519 for the
Yubikey 5C NFC. I can't use RSA or larger keys if I want to be able to use it
with NFC.

I backed up my revokal certificates that were put in the `~/.gnupg/` directory
as indicated after they were generated, and I exported and backed up the public
keys, then I uploaded the keys to a keyserver.

```
gpg --export --armor 0F6D5021A87F92BA > 0F6D5021A87F92BA.asc
gpg --send-keys 0F6D5021A87F92BA

gpg --export --armor F9BC985B3BF972C7 > F9BC985B3BF972C7.asc
gpg --send-keys F9BC985B3BF972C7
```

I started putting passwords into pass using `pass init 0F6D5021A87F92BA
F9BC985B3BF972C7`. That lets me encrypt to both Yubikeys at once. Now if I lose
or accidentally wipe one of the Yubikeys again the other will be able to
decrypt my passwords. I also signed the keys with each other, just to show that
both are valid if one were to be lost.

While I did all this I thought I might as well enable 2FA using both the
Yubikeys on every account that supported it. Google actually has something
cool called Advanced Protection which allows you to set up your account with 2
yubikeys to login with, so I enabled that for my Google account.

I downloaded the [password
store](https://play.google.com/store/apps/details?id=dev.msfjarvis.aps) Android
app for my phone, along with [Openkeychain](https://www.openkeychain.org/).
This part wasn't too hard to set up, I just searched for my key on the
keyserver that I just uploaded it to, then imported it. I went through the
setup to add a security token and imported it so that it was recognized as one
of my keys.

At this point I set up my password store with git to use for syncing. I set it
up on some mirrors just in case one went down, and I backed it up to Nextcloud.

```
git remote add all git@seanbehan.dev:pass
git remote set-url --add --push all git@seanbehan.dev:pass
git remote set-url --add --push all git@git.sr.ht:~codebam/pass
git remote set-url --add --push all git@git.maych.in:codebam/password-store
git push --set-upstream all master
```

I actually set up git on my own server here too. To do this I added a new user
named `git` and added my ssh keys to it, then inside it's home directory I made
git repositories to push to using.

```
mkdir pass
cd pass
git init --bare
```

I generated a new SSH key from within the password store app and used that for
authentication from my phone. On my laptop I set up gpg-agent with ssh support
so that I could use my yubikey as an SSH key as well as a PGP key.

### `~/.bashrc`

```sh
export GPG_TTY="$(tty)"
export SSH_AUTH_SOCK="/run/user/$UID/gnupg/S.gpg-agent.ssh"
gpg-connect-agent updatestartuptty /bye > /dev/null
```

### `~/.gnupg/gpg.conf`

```conf
use-agent
```

Then I used `ssh-add -L` to show my public SSH key for each yubikey to put on
the server.

I used pass for 2FA as well because the password store app supports that. I
just scanned the code and installed `pass-otp` on Fedora to get support for
OTPs.

I installed the [PassFF](https://github.com/passff/passff) Firefox extention to
get support for pass in my browser, and turned on autofill on my phone so that
it can autofill everywhere.

I set up git to sign all my commits so that it shows that my commits are signed
and valid.

```
git config --global user.signingkey 0F6D5021A87F92BA
git config --global commit.gpgsign true
```

As an extra layer of security on Fedora I installed the `pam-u2f` package on
and generated U2F logins.

```
sudo pamu2fcfg -uroot >> /etc/u2f_mappings
```

I ran it once for each key, then opened the file and edit it so it looked like
this.

### Before

```
root:key1root:key2
```

### After

```
root:key1:key2
codebam:key1:key2
```

In `/etc/pam.d/system-auth` I added a line to the very top above all the other
`auth`.

```
auth	    required              pam_u2f.so authfile=/etc/u2f_mappings
```

I added the same line to `/etc/pam.d/su` as well so that my user and root
requires a yubikey to `su`.

This makes it so that `sudo`, `su`, and logging in through a `getty` (not in
GDM for some reason, but I haven't fixed it) require you to tap the yubikey
before typing the password. Two factors of authentication for my computer, and
every online service that supports it, backed by hardware.

Once I was done all this I committed my changes to my dotfiles pushed them to
git so that I could easily set the same thing up on my desktop which is also
running Fedora.
