import { execa } from "execa";

(async () => {
  const cwd = "/home/slawa/dev/flutter_site_container";
  const cmd = "/snap/bin/flutter build appbundle --verbose > flutter.txt";
  console.info(cwd, ">", cmd);
  const res = await execa({
    cwd,
    shell: true,
    all: true,
    stdout: "inherit",
  })`${cmd}`;
  console.log("done", res);
})();
