---
title: 'USB Cable Testing on Linux'
date: 2026-04-15T07:11:06.679Z
tags:
  - usb
  - linux
  - wireshark
  - test
draft: false
---

I was interested in testing my USB cables that I know work, but wanted to see if they had any retransmission going on.

Then today, I found out Linux has a kernel module that allows you to "monitor" usb interfaces. Like... using wireshark.

I won't explain how to set up wireshark for your distro, that's for you to figure out.

Once you have wireshark set up, you just `sudo modprobe usbmon` then `lsusb`.
Find the USB interface you want to monitor in the list, then select it when starting wireshark (gui).

That's about it... you can filter like this:

```
usb.urb_status != 0 && !(usb.urb_status == -115)
```

Short post, but hope this helps you test your own USB cables for any errors that aren't shown in dmesg, like failed packets.
