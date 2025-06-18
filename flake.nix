{
  inputs = {
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
            nodePackages_latest.nodejs
            nodePackages_latest.typescript-language-server
            nodePackages_latest.prettier
            nodePackages_latest.svelte-language-server
            tailwindcss-language-server
            vscode-langservers-extracted
          ];
        };
      }
    );
}
