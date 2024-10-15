import { Logger } from "@/lib/splunk";
import spawn from "nano-spawn";

(async () => {
  for await (const line of spawn("ls", ["-l"])) {
    console.log(line);
    Logger.info(line);
  }
})();
