const cron = require("node-cron");
const pool = require("../config/db");
const moment = require("moment");

const generateSlots = async () => {
  const howManyDays = 3;
  const startTime = 6;
  const endTime = 12;
  const interval = 60;

  for (let day = 0; day < howManyDays; day++) {
    const date = moment().add(day, "days").startOf("day");

    for (let hour = startTime; hour < endTime; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const slotTime = moment(date)
          .set({ hour, minute, second: 0, millisecond: 0 })
          .utc()
          .format();

        const timeOnly = moment(slotTime).format("HH:mm:ss");
        const dateOnly = moment(slotTime).format("YYYY-MM-DD");

        try {
          const existing = await pool.query(
            "SELECT * FROM time_slots WHERE date = $1 AND time_slot = $2",
            [dateOnly, timeOnly]
          );

          if (existing.rows.length === 0) {
            await pool.query(
              "INSERT INTO time_slots (date, time_slot, available) VALUES ($1, $2, $3)",
              [dateOnly, timeOnly, true]
            );
            console.log(`Added slot on ${dateOnly} at ${timeOnly}`);
          }
        } catch (error) {
          console.error("Error inserting slot:", error.message);
        }
      }
    }
  }
};

cron.schedule("0 0 * * *", () => {
  console.log("⏰ Running slot generation cron job");
  generateSlots();
});

module.exports = generateSlots;
