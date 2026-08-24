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
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            typescript-language-server
            prettier
            astro-language-server
            # Still here after the move to Astro: the moving parts of the home
            # page (Grainient, DotGrid, StarBorder) are Svelte islands.
            svelte-language-server
            tailwindcss-language-server
            vscode-langservers-extracted
          ];
        };
      }
    );
}
