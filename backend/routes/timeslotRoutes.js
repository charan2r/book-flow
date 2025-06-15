const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET all timeslots
router.get("/slots", authMiddleware, async (req, res) => {
  try {
    const allTimeslots = await pool.query("SELECT * FROM time_slots");
    res.json(allTimeslots.rows);
  } catch (error) {
    console.error(error.message);
    return res.status(404).json("No timeslots were found");
  }
});

module.exports = router;
