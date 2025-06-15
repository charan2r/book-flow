/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/appointment/view"
      );
      setAppointments(response.data);
    } catch (error) {
      setError("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (appt) => {
    setSelectedAppointment(appt);
    setOpenDialog(true);
  };

  // Cancel appointment
  const confirmCancel = async () => {
    if (!selectedAppointment) return;

    try {
      await axios.delete(
        `http://localhost:5000/appointment/cancel/${selectedAppointment.id}`
      );
      setAppointments(
        appointments.map((appt) =>
          appt.id === selectedAppointment.id
            ? { ...appt, status: "cancelled" }
            : appt
        )
      );
      toast.success("Appointment canceled successfully!");
    } catch (error) {
      toast.error("Error canceling appointment.");
    } finally {
      setOpenDialog(false);
      setSelectedAppointment(null);
    }
  };

  if (loading)
    return (
      <p className="text-center text-lg text-gray-600">
        Loading appointments...
      </p>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-4xl w-full p-6 bg-white shadow-lg rounded-lg">
          <ToastContainer />
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            My Appointments
          </h2>
          <div className="overflow-x-auto">
            <Table className="w-full border border-gray-300">
              <TableHead>
                <TableRow className="bg-blue-500 text-white">
                  <TableCell className="font-semibold">Date</TableCell>
                  <TableCell className="font-semibold">Time Slot</TableCell>
                  <TableCell className="font-semibold">Status</TableCell>
                  <TableCell className="font-semibold text-center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow
                    key={appt.id}
                    className="border-b hover:bg-gray-100"
                  >
                    <TableCell className="py-2 px-4">
                      {new Date(appt.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="py-2 px-4">
                      {new Date(
                        `1970-01-01T${appt.time_slot}`
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </TableCell>
                    <TableCell
                      className={`py-2 px-4 font-semibold ${
                        appt.status === "cancelled"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {appt.status}
                    </TableCell>
                    <TableCell className="py-2 px-4 text-center">
                      {appt.status !== "cancelled" && (
                        <Button
                          onClick={() => handleCancelClick(appt)}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-md shadow-md"
                        >
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Confirmation Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle className="text-gray-800">
              Cancel Appointment
            </DialogTitle>
            <DialogContent>
              <DialogContentText className="text-gray-600">
                Are you sure you want to cancel this appointment?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenDialog(false)}
                className="text-blue-600 hover:underline"
              >
                No
              </Button>
              <Button
                onClick={confirmCancel}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-md shadow-md"
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AppointmentList;
