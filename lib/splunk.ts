import bunyan from "bunyan";
// import BFormat from "bunyan-format";
import * as bunyanDebugStream from "bunyan-debug-stream";
// const config = {
//   token: process.env.SPLUNK_TOKEN,
//   url: "https://localhost:8088",
// };

// const splunkStream = splunkBunyan.createStream(config);
// splunkStream.on("error", function (err, context) {
//   // Handle errors here
//   console.log("Error", err, "Context", context);
// });

// let formatOut = new BFormat({ outputMode: "short" });

// Note: splunkStream must be set to an element in the streams array
export const Logger = bunyan.createLogger({
  name: "web2app",
  serializers: bunyanDebugStream.serializers,
  streams: [
    // { type: "raw", stream: formatOut },
    // splunkStream,
    // {
    //   type: "raw",
    //   stream: consoleStream.createStream(),
    // },
    {
      level: "info",
      type: "raw",
      stream: bunyanDebugStream.create({
        basepath: process.cwd(), // this should be the root folder of your project.
        forceColor: true,
      }),
    },
  ],
});
