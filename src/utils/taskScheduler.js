import cron from 'node-cron';
import User from '../models/userModel.js';
import { sendReminderEmail } from './mailer.js';
// cron.schedule('* * * * *', ()=>{
//     console.log('Task executed every minute');
// });


// Run every Monday at 9 AM
cron.schedule("40 15 * * *", async () => {
  try {
    console.log("Weekly reminder job started...");

    // Fetch all users
    const users = await User.find();

    // Loop through each user
    await Promise.all(
      users.map((user) =>
        sendReminderEmail(
          user.email,
          user.name,
          `<p>Hi ${user.name}, don't forget about Avihs Builder 🚀</p>`
        )
      )
    );

    console.log("Weekly reminder emails sent to all users!");
  } catch (err) {
    console.error("Error sending reminder emails:", err);
  }
});