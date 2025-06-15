/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

// Timezone and UTC plugins for Day.js
dayjs.extend(utc);
dayjs.extend(timezone);

// Modal component for booking appointment
const AppointmentModal = ({ isOpen, closeModal, selectedSlot, onSubmit }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  useEffect(() => {
    if (selectedSlot) {
      setDate(dayjs(selectedSlot.date).format("YYYY-MM-DD")); // Ensure correct date format
      setTimeSlot(selectedSlot.time_slot);
    }
  }, [selectedSlot]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !timeSlot) {
      console.error("Date or time slot is not selected");
      toast.error("Please select a date and time slot");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/appointment/book",
        {
          name: name,
          date,
          time_slot: timeSlot,
        }
      );
      console.log("Appointment booked successfully:", response.data);
      toast.success("Appointment booked successfully");
      onSubmit();
      closeModal();
    } catch (error) {
      console.error(
        "Error booking appointment:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.error || "Error booking appointment");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Book an Appointment
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600" htmlFor="date">
              Date
            </label>
            <input
              type="text"
              id="date"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={date}
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600" htmlFor="timeSlot">
              Time Slot
            </label>
            <input
              type="text"
              id="timeSlot"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={timeSlot}
              disabled
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
          >
            Book Appointment
          </button>
        </form>
        <button
          className="mt-4 text-blue-500 hover:text-blue-600"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Calendars = ({ onDateSelect }) => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().startOf("day"));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch available time slots from the API
  useEffect(() => {
    axios
      .get("http://localhost:5000/timeslot/slots", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Fetched slots:", response.data); // Debugging
        setAvailableSlots(response.data);
      })
      .catch((error) => console.error("Error fetching slots:", error));
  }, []);

  // Convert API date format to "YYYY-MM-DD"
  const availableDates = availableSlots.map((slot) =>
    dayjs(slot.date).format("YYYY-MM-DD")
  );

  const openBookingModal = (slot) => {
    setSelectedSlot({
      ...slot,
      date: dayjs(slot.date).format("YYYY-MM-DD"),
    });
    setIsModalOpen(true);
  };

  const closeBookingModal = () => {
    setSelectedSlot(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
        Select a Date
      </h2>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="bg-white shadow-2xl border border-gray-200 rounded-xl p-6 max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <DateCalendar
              value={selectedDate}
              onChange={(newDate) => {
                if (newDate) {
                  const localDate = newDate.startOf("day").utcOffset(0, true); // Prevent timezone shift
                  setSelectedDate(localDate);
                  onDateSelect(localDate.format("YYYY-MM-DD"));
                }
              }}
              shouldDisableDate={(date) =>
                !availableDates.includes(date.format("YYYY-MM-DD"))
              }
            />
          </motion.div>
        </div>
      </LocalizationProvider>

      {/* Available Time Slots Section */}
      <div className="mt-6 ">
        <h3 className="text-xl font-medium text-gray-800 mb-3 text-center">
          Available Time Slots
        </h3>

        <div className="flex flex-col gap-2 max-w-md mx-auto">
          {availableSlots
            .filter(
              (slot) =>
                dayjs(slot.date).format("YYYY-MM-DD") ===
                selectedDate.format("YYYY-MM-DD")
            )
            .map((slot) => (
              <button
                key={slot.id}
                className={`py-2 px-4 text-lg font-semibold rounded-lg transition ${
                  slot.available
                    ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
                disabled={!slot.available}
                onClick={() => openBookingModal(slot)}
              >
                {slot.time_slot} {slot.available ? "(Available)" : "(Booked)"}
              </button>
            ))}
        </div>
      </div>

      {/* Appointment Booking Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        closeModal={closeBookingModal}
        selectedSlot={selectedSlot}
        onSubmit={() => closeBookingModal()}
      />

      <ToastContainer />
    </>
  );
};

export default Calendars;
