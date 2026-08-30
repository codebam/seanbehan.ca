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
      }
    );
}
