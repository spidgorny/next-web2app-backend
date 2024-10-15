import bunyan from "bunyan";
import splunkBunyan from "splunk-bunyan-logger";

const config = {
  token: process.env.SPLUNK_TOKEN,
  url: "https://localhost:8088",
};

const splunkStream = splunkBunyan.createStream(config);

// Note: splunkStream must be set to an element in the streams array
export const Logger = bunyan.createLogger({
  name: "web2app",
  streams: [splunkStream],
});
