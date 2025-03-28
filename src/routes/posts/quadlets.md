---
title: 'Podman Quadlets'
date: 2025-03-28T14:39:58Z
tags:
  - linux
  - systemd
  - podman
  - containers
  - quadlet
draft: false
---

In this post I'll show you what a quadlet is and how you can use it to manage
your containers.

Quadlets are a new way to manage containers using systemd. They are a new
format for systemd units that allow you to manage containers using systemd.

Here's an example of a container quadlet.

```systemd
[Container]
Image=docker.io/library/alpine:latest
Exec=sleep infinity
AutoUpdate=registry
```

If you put this in ~/.config/containers/systemd/alpine.container you can start
it with `systemctl --user start alpine` and it will start a new container.

Just make sure to `systemctl --user daemon-reload` to reload the systemd daemon
after you create the quadlet. You have to do this every time, I won't repeat
this throughout the blog post.

You can also use quadlets to manage pods. Here's an example of a pod quadlet.

```systemd
[Pod]
```

Yep, that's it. If you put it in `~/.config/containers/systemd/mypod.pod` you can
start it with `systemctl --user start mypod-pod` and it will start a new pod.

But the best part is this. If you want to add a container to a pod all you have
to do is this.

```systemd
[Container]
Image=docker.io/library/alpine:latest
Exec=sleep infinity
AutoUpdate=registry
Pod=mypod.pod
```

Now when you start `mypod-pod` it will start the container as well.

You can add dependencies.

```systemd
[Unit]
After=alpine.service

[Container]
Image=docker.io/library/archlinux:latest
Exec=sleep infinity
AutoUpdate=registry
Pod=mypod.pod
```

Now archlinux will start after alpine.

There are even more options. You can start .kube, .network, and .build quadlets
too and they can depend on each other. See the
[docs](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html)
for more info!

---

Okay so now lets run something useful :)

How about an nginx container and a certbot container to get a certificate for it?

First we need to create a quadlet for our nginx container.

```systemd
[Container]
Image=docker.io/nginx:latest
PublishPort=80:80
PublishPort=443:443
AutoUpdate=registry
```

This will run a web server for us. If you aren't root, you'll need to enable unprivleged ports.

```sh
sudo sysctl net.ipv4.ip_unprivileged_port_start=0
```

Now we can start it with `systemctl --user start nginx` and it will start a new container.

If you browse to `http://localhost` you should see the nginx welcome page.

Now we need to get a certificate for it. We can use certbot for this.

```systemd
[Container]
Image=docker.io/certbot/certbot:latest
Exec=certonly --standalone --agree-tos --email your@email.com -d your.domain.com
AutoUpdate=registry
Volume=letsencrypt:/etc/letsencrypt
```

Make sure to replace your@email.com and your.domain.com with your own email and domain.

Then start the container with `systemctl --user start certbot` and it will get a certificate for you.

Now you can use the certificate in your nginx container.

```systemd
[Container]
Image=docker.io/nginx:latest
PublishPort=80:80
PublishPort=443:443
AutoUpdate=registry
Volume=letsencrypt:/etc/letsencrypt
```

That's great, but now we need to configure nginx to use the certificate. We can
do this by adding a volume for the configuration file.


```systemd
[Container]
Image=docker.io/nginx:latest
PublishPort=80:80
PublishPort=443:443
AutoUpdate=registry
Volume=letsencrypt:/etc/nginx/certs
Volume=./nginx.conf:/etc/nginx/conf.d
```

```nginx
server {
    listen 443 ssl;
    server_name your.domain.com;

    ssl_certificate /etc/nginx/certs/live/your.domain.com/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/live/your.domain.com/privkey.pem;

    location / {
        root /usr/share/nginx/html;
        index index.html;
    }
}
```

Again, make sure to replace your.domain.com with your own domain.

Now you can start the container with `systemctl --user start nginx` and it will
start a new container with the certificate. You can verify this by going to
`https://your.domain.com`.

Now you have a web server with HTTPS.

If you want to renew your certificate automatically it's as simple as this.

```systemd
[Container]
Image=docker.io/certbot/certbot:latest
Exec=renew
AutoUpdate=registry
Volume=letsencrypt:/etc/letsencrypt
```

Now you can create a timer for it in `~/.config/systemd/user/certbot.timer`.

```systemd
[Unit]
Description=Renew Certbot certificates

[Timer]
OnCalendar=Sun 00:00:00
Persistent=true
Unit=certbot.service

[Install]
WantedBy=timers.target
```

Now you enable the timer.

```sh
systemctl --user enable --now certbot.timer
```

Now your certificate will be renewed every Sunday at midnight.

That's it! Now you have a web server with HTTPS and a certificate that will be
renewed automatically.
