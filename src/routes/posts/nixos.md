---
title: 'NixOS Flakes'
date: 2024-06-01T22:38:41Z
tags:
  - nixos
draft: false
---

Flakes in NixOS allow you to write Nix code that has custom inputs and outputs.
For example this is a simple example of a Flake. You can get a copy for
yourself by running `nix flake init`.

```nix
{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }: {

    packages.x86_64-linux.hello = nixpkgs.legacyPackages.x86_64-linux.hello;

    packages.x86_64-linux.default = self.packages.x86_64-linux.hello;

  };
}
```

As you can see there are inputs (nixpkgs), and outputs (self, nixpkgs).

If you build this Flake using `nix build` you'll end up with a new directory
called `result` which is a symlink to where the package was built in your Nix
store.

```shell
result -> /nix/store/yh6x9ia5kxxw3w90vkb09vqgfvhb416k-hello-2.12.1
```

You'll also end up with a `flake.lock`. If you've used `npm` before
`flake.lock` is very similar to `package-lock.json`. If you haven't, a quick
explanation is that it keeps track of package versions and keeps them locked
between updates. If you want to update your lockfile so you can get a newer
package version you can do so with `nix flake update`

Now so far I've only showed a very basic example of a Flake, the example from
`nix flake init`. You can see more templates with `nix flake show templates`.

One thing I like using Flakes for is to create a `devShell`. You can initialize
a Flake with a `devShell` preconfigured with `nix flake init -t
templates#utils-generic`

```nix
{
  inputs = {
    utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, utils }: utils.lib.eachDefaultSystem (system:
    let
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      devShell = pkgs.mkShell {
        buildInputs = with pkgs; [
        ];
      };
    }
  );
}
```

In this example you can add packages from nixpkgs to `buildInputs` for them to
be installed temporarily. You can activate it with `nix develop`. This is the
`devShell` I use for my typescript projects.

```nix
# ...
      devShell = pkgs.mkShell {
        buildInputs = with pkgs; [
          efm-langserver
          nil
          nodePackages_latest.nodejs
          nodePackages_latest.typescript-language-server
          nodePackages_latest.prettier
          vscode-langservers-extracted
          nodePackages_latest.bash-language-server
        ];
      };
# ...
```

You can use Flakes to build packages as well. You can look at just about any
Nix package for an example. Just choose one in
[nixpkgs](https://github.com/nixos/nixpkgs). Flakes have many functions to
build different types of packages as you can see in nixpkgs.
