# Appointment Booking System

A simple Appointment Booking System built with the **PERN stack** (PostgreSQL, Express, React, Node.js) that allows users to view available time slots, book appointments, and manage their bookings.

## Features
- **View Available Time Slots**: Display a calendar with available time slots for appointments.
- **Book an Appointment**: Users can select a date, time slot, and provide their details to book an appointment.
- **View Booked Appointments**: Users can see a list of their booked appointments.
- **Cancel an Appointment**: Users can cancel an appointment.
- **Authentication**: JWT authentication for users to log in, sign up, and access their bookings.

## Tools and Technologies Used
- **Front-End**:
  - **React.js**: For building the user interface.
  - **TailwindCSS**: Utility-first CSS framework for styling.
  - **Material-UI**: UI library for components like the calendar.
  - **Axios**: For making API requests to the backend.
  - **React Router**: For navigation between different pages (Home, My Appointments).
  - **React Toastify**: For showing notifications to users.

- **Back-End**:
  - **Node.js** & **Express.js**: Server-side technologies for building APIs.
  - **PostgreSQL**: Relational database to store user data, appointments, and available time slots.

## Steps to Set Up and Run the Project Locally

### Backend
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/appointment-booking-system.git
    cd appointment-booking-system
    cd backend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file and add the following:
    ```bash
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=appointment_system
    PORT=5000
    JWT_SECRET=yoursecretkey
    ```

4. Run the backend server:
    ```bash
    npm start
    ```

### Frontend
1. Go to the frontend folder:
    ```bash
    cd ../frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Run the frontend app:
    ```bash
    npm run dev
    ```

## Endpoints

### Authentication
- **POST** `/user/register`: Register a new user.
- **POST** `/user/login`: Login to an existing account.

### Appointments
- **GET** `/timeslot/slots`: Fetch all timeslots.
- **POST** `/appointment/book`: Book an appointment.
- **GET** `/api/appointments`: Get all booked appointments for a user.
- **DELETE** `/api/appointments/:id` : Cancel a specific appointment.


