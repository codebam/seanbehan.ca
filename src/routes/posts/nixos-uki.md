---
title: 'Secure Boot NixOS UKI Installer'
date: 2025-07-06T13:57:04-04:00
tags:
  - nixos
  - secure boot
  - steam deck
draft: false
---

### Introduction

In this post I simply want to share a NixOS flake that might help you in the
case you enabled secure boot on a device such as the Steam Deck OLED, still
have keys because you backed them up, and want to get back in to either disable
secure boot with sbctl, or fix your unbootable NixOS system.

### Configuration

First, here is the flake that will load your configuration:

```nix
{
  description = "";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };

      nixosImage = nixpkgs.lib.nixosSystem {
        inherit system;
        modules = [
          ./image-config.nix
        ];
      };
    in
    {
      packages.${system}.disk-image = nixosImage.config.system.build."image";

      defaultPackage.${system} = self.packages.${system}.disk-image;
    };
}
```

Now the config that you can use to build an image.

```nix
(
  {
    config,
    lib,
    pkgs,
    modulesPath,
    ...
  }:
  {

    imports = [ "${modulesPath}/image/repart.nix" ];

    boot.loader.grub.enable = false;
    boot.initrd.availableKernelModules = [ "usb_storage" ];
    boot.supportedFilesystems = [ "btrfs" ];
    hardware.enableAllHardware = true;
    environment.systemPackages = with pkgs; [
      btrfs-progs
      # sbctl # if you want it to be able to disable secure boot
     ];

    fileSystems."/".device = "/dev/disk/by-label/nixos";

    networking = {
      networkmanager = {
        enable = true;
        wifi.backend = "iwd";
      };
      wireless.iwd = {
        enable = true;
      };
    };

    users = {
      users = {
        codebam = {
          isNormalUser = true;
          home = "/home/codebam";
          description = "Sean Behan";
          extraGroups = [
            "wheel"
            "networkmanager"
            "libvirtd"
            "video"
            "uinput"
            "wireshark"
            "pipewire"
          ];
          hashedPassword = "$6$TIP8YR83obmkq8T2$T3lYdPbPj9wysMznNlS5J0qHo2eyTr43aF/ZWSMWHdNRob4dkBB0s3KpBLUgYRTyPZxbb1ZgeqCrrx.DEEkQX1";
        };
      };
    };

    image.repart = {
      name = "image";
      partitions = {
        "esp" = {
          contents = {
            "/EFI/BOOT/BOOT${lib.toUpper pkgs.stdenv.hostPlatform.efiArch}.EFI".source =
              "${pkgs.systemd}/lib/systemd/boot/efi/systemd-boot${pkgs.stdenv.hostPlatform.efiArch}.efi";

            "/EFI/Linux/${config.system.boot.loader.ukiFile}".source =
              "${config.system.build.uki}/${config.system.boot.loader.ukiFile}";
          };
          repartConfig = {
            Type = "esp";
            Format = "vfat";
            SizeMinBytes = "96M";
          };
        };
        "root" = {
          storePaths = [ config.system.build.toplevel ];
          repartConfig = {
            Type = "root";
            Format = "ext4";
            Label = "nixos";
            Minimize = "guess";
          };
        };
      };
    };
  }
)
```

### Building

### Building the Image

```sh
nix build
```

Make sure you change the user and password, or you won't be able to login. Also
note that if you are using a Steam Deck OLED like me, WiFi won't work so you'll
need to use either ethernet or an external wireless adapter that has support in
the kernel.

### Signing for Secure Boot

So ok you burn it to your USB drive:

(replace X with your USB drive letter, and add sudo or elevate)

```sh
dd if=./result/image.raw of=/dev/sdX bs=4M status=progress
```

Now you have to sign it if you want secure boot to work. Assuming you already
have keys set up you just run:

(again with sudo or elevate)

```sh
mount /dev/sdX1 /mnt
sbctl sign /mnt/EFI/BOOT/BOOTX64.EFI
sbctl sign /mnt/EFI/Linux/nixos.efi
sync
umount /mnt
```

### Booting and Repair

Now you're ready to boot it, so plug it into your USB hub or however you planned
on plugging it into the Steam Deck or your device.

Once you're in you will have access to a NixOS installer, and you should know
what to do next to repair.
