import { execa } from "execa";

(async () => {
  const cwd = "/home/slawa/dev/flutter_site_container";
  const cmd = "script -c 'flutter build appbundle'";
  console.info(cwd, ">", cmd);
  const res = await execa({
    cwd,
    shell: true,
    all: true,
  })`${cmd}`;
  console.log("done in", res.durationMs, res.all);
})();
