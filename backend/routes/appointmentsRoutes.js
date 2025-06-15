const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// Get all appointments
router.get("/view", async (req, res) => {
  try {
    const allAppointments = await pool.query("SELECT * FROM appointments");
    res.json(allAppointments.rows);
  } catch (error) {
    console.log("No appointments were found", error.message);
    res.status(404).send("No appointments were found");
  }
});

// Book an appointment
router.post("/book", async (req, res) => {
  const { name, date, time_slot } = req.body;

  // Input validation
  if (!name || !date || !time_slot) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    // Fetch user_id based on name
    const user = await pool.query("SELECT id FROM users WHERE name = $1", [
      name,
    ]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "User not found!" });
    }
    const user_id = user.rows[0].id;

    // Check if the slot is already booked
    const existing = await pool.query(
      "SELECT * FROM appointments WHERE date = $1 AND time_slot = $2",
      [date, time_slot]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Time slot already booked!" });
    }

    // Insert appointment with user_id
    const result = await pool.query(
      "INSERT INTO appointments (user_id, name, date, time_slot) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, name, date, time_slot]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Internal Server error", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Cancel an appointment
router.delete("/cancel/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE appointments SET status = $1 WHERE id = $2",
      ["cancelled", id]
    );
    res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Internal Server error", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
