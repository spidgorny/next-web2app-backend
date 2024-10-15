import { Logger } from "@/lib/splunk";

const payload = {
  // Message can be anything; doesn't have to be an object
  message: {
    temperature: "70F",
    chickenCount: 500,
  },
};

console.log("Sending payload", payload);
Logger.info(payload, "Chicken coup looks stable.");
