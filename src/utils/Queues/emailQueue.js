import Queue from "bull";
import { sendConfirmationEmail } from "../mailer.js";

// create queue, connect to Redis
export const emailQueue = new Queue("email-queue", {
  redis: { host: "127.0.0.1", port: 6379 },
});

// process jobs (consumer)
emailQueue.process(async (job) => {
  const { to, name } = job.data;
  await sendConfirmationEmail(to, name);
  console.log(`Email sent to ${to}`);
});

// export default emailQueue;
