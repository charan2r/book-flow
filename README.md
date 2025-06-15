# 🤖 AI-Powered Appointment Booking System

This is a full-stack Appointment Booking system with an integrated AI chatbot using OpenAI and FastAPI. It allows users to view, book, and cancel appointments via a calendar interface and a chatbot.

---

## 🧩 Features

- 📅 **Calendar UI** – View available time slots with React Big Calendar.
- ✅ **Book Appointments** – Book directly from the calendar interface.
- ❌ **Cancel Appointments** – Cancel existing appointments.
- 🤖 **AI Chatbot Integration** – Book or cancel appointments using natural language.
- 🔐 **Auth-Ready** – Can be extended to use JWT for authentication.

---

## 🏗️ Tech Stack

| Layer     | Technology                                |
|-----------|------------------------------------------ |
| Frontend  | React + Tailwind CSS + React Big Calendar |
| Backend   | Node.js + Express.js                      |
| Chatbot   | FastAPI (Python) + OpenAI API             |
| Database  | PostgreSQL                                |

---

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
### Bot Service Setup (FastAPI)
  ````bash
    cd chat_service
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    uvicorn chat_service:app --reload --port 8000
  ````

## Endpoints

### Authentication
- **POST** `/auth/register`: Register a new user.
- **POST** `/auth/login`: Login to an existing account.

### Appointments
- **GET** `/timeslot/slots`: Fetch all timeslots.
- **POST** `/appointment/book`: Book an appointment.
- **GET** `/appointment/view`: Get all booked appointments for a user.
- **DELETE** `appointment/cancel/:id` : Cancel a specific appointment.

### Chatbot
- **POST** `/api/chat`: AI Chatbot conversation.


---

#### 🧠 AI Integration
 - Uses OpenAI's gpt-3.5-turbo to process user queries.
 - Handles natural language inputs like:
   - "Hello, can you book an appointment on June 20 at 2 PM?”
   - “Cancel my appointment on Jun 15 at 6 AM”
 -  FastAPI microservice processes intent and communicates with the main backend.

---


### 🧑‍💻 Author
 - Charan Romi
 - Built with ❤️ for smarter appointment experiences.
