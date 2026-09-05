{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      utils,
    }:
    utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        # ------------------------------------------------------------------
        # The résumé pipeline (resume/build.sh), kept out of devShell on
        # purpose: TeX is a large closure and only one script in the repo needs
        # it, so it is asked for with `nix run .#resume` rather than pulled into
        # every shell the flake opens.
        # ------------------------------------------------------------------
        resumeTools = with pkgs; [
          pandoc
          tectonic
          poppler-utils # pdfinfo, for the page count build.sh reports
        ];
        # templates/resume.latex names faces through fontconfig, so the fonts
        # have to be *findable*, which in a store path means being on
        # XDG_DATA_DIRS rather than installed system-wide.
        resumeFonts = with pkgs; [
          gyre-fonts # TeX Gyre Pagella (body) and Heros (titles)
          dejavu_fonts # the template's fallback chain
          liberation_ttf
          fira-code
        ];
        resumeToolchain = pkgs.buildEnv {
          name = "resume-toolchain";
          paths = resumeTools ++ resumeFonts;
          pathsToLink = [
            "/bin"
            "/share/fonts"
          ];
        };
      in
      {
        devShell = pkgs.mkShell {
          # Vite's embedded workerd does not discover NixOS's system CA store.
          NODE_EXTRA_CA_CERTS = "${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt";
          buildInputs = with pkgs; [
            nodejs_26
            typescript-language-server
            prettier
            astro-language-server
            tailwindcss-language-server
            vscode-langservers-extracted
          ];
        };

        packages = {
          # The toolchain on its own, for poking at it: `nix build .#resume-toolchain`,
          # and CI runs pdfinfo out of it. Named with the dash the command has,
          # because `inherit` would publish the camelCase binding instead.
          resume-toolchain = resumeToolchain;
        };

        apps = {
          # nix run .#resume                     -> resume.pdf + resume.html in cwd
          # nix run .#resume -- --outdir out     -> ...into out/
          # nix run .#resume -- --pdf --open     -> only the PDF, then look at it
          #
          # The script is found relative to the caller's directory rather than
          # the flake's: referencing `${self}` here would copy the whole working
          # tree, node_modules included, into the store on every run.
          resume = {
            type = "app";
            program = toString (
              pkgs.writeShellScript "resume-build" ''
                set -eu

                PATH="${pkgs.lib.makeBinPath resumeTools}:$PATH"
                XDG_DATA_DIRS="${resumeToolchain}/share:''${XDG_DATA_DIRS:-/usr/local/share:/usr/share}"
                export PATH XDG_DATA_DIRS

                for script in "$PWD/resume/build.sh" "$PWD/build.sh"; do
                  if test -f "$script"; then
                    exec "$script" "$@"
                  fi
                done
                echo "nix run .#resume: no resume/build.sh in $PWD — run it from the repo root" >&2
                exit 1
              ''
            );
          };
        };
      }
    );
}
