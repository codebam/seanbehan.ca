---
title: "Flatpak Mesa Git"
date: 2023-05-25T17:48:28Z
tags:
    - linux
    - graphics
draft: false
---

If you've switched to Flatpak for gaming you may notice that Mesa is sometimes a little bit old. The issue I had myself was that my 6000 series AMD graphics card didn't have up to date graphics drivers, resulting in OpenGL games not running on the graphics card, but rather the CPUs OpenGL implementation, which made games such as CS:GO and Minecraft run at 5 or 10 FPS.

To get the latest Mesa git on Flatpak you can install it like this:

```sh
flatpak install org.freedesktop.Platform.GL.mesa-git org.freedesktop.Platform.GL32.mesa-git
```

This will allow you to install the latest Mesa graphics drivers to allow applications to detect hardware properly and run better. Make sure when you are prompted for a version of Mesa to install you choose the latest version number that doesn't have "beta" at the end.

Once you've done this you can run your Flatpak like this to use Mesa git.

```sh
FLATPAK_GL_DRIVERS=mesa-git flatpak run com.valvesoftware.Steam
```

You can also export `FLATPAK_GL_DRIVERS=mesa-git` in your `.bashrc` or `.profile` to use Mesa git for all Flatpak applications. This may cause issues though, and I'd personally advise you only use it when it's needed.