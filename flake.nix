{
  description = "Flake for keti portfolio";

  inputs = {
    nixpkgs = {
      url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    };
    flake-utils = {
      url = "github:numtide/flake-utils";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ ];
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
            bun
            sqlite

            # might not end up being useful but lets have it nevertheless
            vips
            glib
            gdk-pixbuf
            libjpeg
            libpng
            libwebp
            libtiff
          ];
        };
      }
    );
}
