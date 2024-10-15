import bunyan from "bunyan";
import splunkBunyan from "splunk-bunyan-logger";

const config = {
  token: process.env.SPLUNK_TOKEN,
  url: "https://localhost:8088",
};

const splunkStream = splunkBunyan.createStream(config);

// Note: splunkStream must be set to an element in the streams array
const Logger = bunyan.createLogger({
  name: "my logger",
  streams: [splunkStream],
});

const payload = {
  // Message can be anything; doesn't have to be an object
  message: {
    temperature: "70F",
    chickenCount: 500,
  },
};

console.log("Sending payload", payload);
Logger.info(payload, "Chicken coup looks stable.");
