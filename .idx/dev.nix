{pkgs}: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
    pkgs.yarn
  ];
  idx.extensions = [
    "svelte.svelte-vscode"
    "vue.volar"
  ];
  idx.previews = {
    previews = {
      default = {
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "--port"
          "3000"
          "--host"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}