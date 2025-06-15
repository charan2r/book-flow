import { useState } from "react";
import axios from "axios";
import { Bot } from "lucide-react";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm your AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleInput = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    try {
      const response = await axios.post("http://localhost:8000/api/chat", {
        message: input,
      });
      const botReply = response.data.reply;
      setMessages([...newMessages, { sender: "bot", text: botReply }]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { sender: "bot", text: "Sorry, I couldn't process your request." },
      ]);
      console.error("Error communicating with the AI service:", error);
    }
  };

  return (
    <>
      {/* Floating bubble button */}
      {!open && (
        <button
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-3xl z-50"
          onClick={() => setOpen(true)}
          aria-label="Open AI Assistant"
        >
          <Bot size={32} />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 bg-white w-80 shadow-2xl rounded-xl p-4 z-50 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 font-bold text-blue-600">
              <Bot size={24} />
              AI Assistant
            </div>
            <button
              className="text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="flex-1 max-h-64 overflow-y-auto mb-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`mb-1 flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <span
                  className={`px-3 py-2 rounded-lg text-sm max-w-[75%] ${
                    m.sender === "user"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              className="border flex-1 p-2 rounded-l-lg focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInput()}
              placeholder="Type your message..."
            />
            <button
              onClick={handleInput}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
