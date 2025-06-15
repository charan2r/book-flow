const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const generateSlots = require("./utils/scheduler");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const userRouter = require("./routes/userRoutes");
const appointmentRouter = require("./routes/appointmentsRoutes");
const timeslotRouter = require("./routes/timeslotRoutes");

app.use("/auth", userRouter);
app.use("/appointment", appointmentRouter);
app.use("/timeslot", timeslotRouter);

generateSlots();

const pool = require("./config/db");
pool
  .connect()
  .then(() => console.log("Postgres connected"))
  .catch((error) => console.error("Error connecting to Postgres", error));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
