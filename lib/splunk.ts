import bunyan from "bunyan";
import splunkBunyan from "splunk-bunyan-logger";
import consoleStream from "bunyan-console-stream";

const config = {
  token: process.env.SPLUNK_TOKEN,
  url: "https://localhost:8088",
};

const splunkStream = splunkBunyan.createStream(config);
splunkStream.on("error", function (err, context) {
  // Handle errors here
  console.log("Error", err, "Context", context);
});

// Note: splunkStream must be set to an element in the streams array
export const Logger = bunyan.createLogger({
  name: "web2app",
  streams: [
    splunkStream,
    {
      type: "raw",
      stream: consoleStream.createStream(),
    },
  ],
});
