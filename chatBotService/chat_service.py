from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import requests
import json
from fastapi.middleware.cors import CORSMiddleware
import dateparser
from dotenv import load_dotenv
import os

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EXPRESS_BASE_URL = "http://localhost:5000"  

class ChatMessage(BaseModel):
    message:str


@app.post("/api/chat")
async def chat(msg: ChatMessage):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
    {
        "role": "system",
        "content": """You are a booking assistant. Extract name, date, and time if the user wants to book. Always return complete JSON.

        If user wants to book, return:
        { "action": "book", "name": "Charan", "date": "June 20", "time": "6am" }

        If user wants to cancel by ID, return:
        { "action": "cancel", "appointment_id": 12 }

        If user wants to cancel by date and time, return:
        { "action": "cancel", "date": "June 20", "time": "6am" }
        """
    },

    {"role": "user", "content": msg.message}
]
    )
    parsed = json.loads(response.choices[0].message.content)
    print("Parsed Response:", parsed)


    # Check if the reply contains keywords for booking or canceling
    if parsed["action"] == "book":
        raw_datetime = dateparser.parse(f"{parsed['date']} {parsed['time']}")
        if not raw_datetime:
            return {"reply": "Could not parse date or time."}

        formatted_date = raw_datetime.strftime("%Y-%m-%d")
        formatted_time = raw_datetime.strftime("%H:%M")
        payload = {
            "name": parsed["name"],
            "date": formatted_date,
            "time_slot": formatted_time
        }
        # Send booking request to Express server
        bookingResponse = requests.post(f"{EXPRESS_BASE_URL}/appointment/book", json=payload)
        print("Booking payload sent:", payload)
        print("Booking response status code:", bookingResponse.status_code)
        print("Booking response content:", bookingResponse.json())

        if bookingResponse.status_code == 201:
            return {"reply": "Booking confirmed!"}
        else:
            return {"reply": "Failed to book appointment."}
        
    elif parsed["action"] == "cancel":
        
        appointment_id = parsed.get("appointment_id")
        # Send cancel request to Express server
        cancelResponse = requests.delete(f"{EXPRESS_BASE_URL}/appointment/cancel/{appointment_id}")
        if cancelResponse.status_code == 200:
            return {"reply": "Cancellation confirmed!"}
        else:
            return {"reply": "Failed to cancel appointment."}
        
    else:
        return {"reply": "I'm sorry, I didn't understand that. Could you please clarify again?"}