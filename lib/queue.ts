import Queue from "bull";

export const queue = new Queue("build-android", {
  redis: {
    host: "localhost",
    port: 6380,
  },
});
