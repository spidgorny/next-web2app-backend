import spawn from "nano-spawn";
import * as fs from "node:fs";
import { once } from "node:events";

(async () => {
  const cwd = "/home/slawa/dev/flutter_site_container";
  const cmd = "flutter build appbundle --verbose";
  console.info(cwd, ">", cmd);
  const stdoutStream = fs.createWriteStream("flutter.log");
  const stderrStream = fs.createWriteStream("flutter.error.log");
  await Promise.all([once(stdoutStream, "open"), once(stderrStream, "open")]);
  const process = spawn(cmd.split(" ")[0], cmd.split(" ").slice(1), {
    cwd,
    // stdout: stdoutStream,
    // stderr: stderrStream,
    stdout: "pipe",
    stderr: "pipe",
    shell: true,
  });
  // for await (const line of process) {
  //   console.log(line);
  // }
  const res = await process;
  console.log("done", res);
})();
