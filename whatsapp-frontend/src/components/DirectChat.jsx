import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export default function DirectChat({ targetEmail }) {
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email);
        fetchMessages(user.email, targetEmail);
      }
    });

    return () => unsubscribe();
  }, [targetEmail]);

  useEffect(() => {
    if (!currentUserEmail || !targetEmail) return;

    const interval = setInterval(() => {
      fetchMessages(currentUserEmail, targetEmail);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentUserEmail, targetEmail]);

  const fetchMessages = async (user1, user2) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/chat/messages?user1=${user1}&user2=${user2}`
      );
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("❌ Error fetching messages:", err);
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    try {
      await axios.post(`${BASE_URL}/api/chat/send`, {
        sender: currentUserEmail,
        receiver: targetEmail,
        text: newMsg,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: currentUserEmail,
          text: newMsg,
          timestamp: new Date().toISOString(),
        },
      ]);
      setNewMsg("");
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };

  // Function to format date separators
  const formatDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString([], options);
  };

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const date = new Date(msg.timestamp).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-3 sm:p-4 bg-gray-100 space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet.</p>
        ) : (
          Object.keys(groupedMessages).map((date) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="text-center mb-3">
                <span className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full select-none">
                  {formatDate(date)}
                </span>
              </div>

              {/* Messages for that date */}
              {groupedMessages[date].map((msg, idx) => (
  <div
    key={idx}
    className={`max-w-[80%] sm:max-w-[70%] p-2 sm:p-3 rounded-lg shadow-md text-sm sm:text-base flex flex-col ${
      msg.sender === currentUserEmail
        ? "ml-auto bg-blue-500 text-white"
        : "mr-auto bg-white text-black"
    }`}
    style={{ marginBottom: "8px" }} // added space between messages
  >
    <p className="break-words">{msg.text}</p>
    <span
      className={`text-[10px] sm:text-xs mt-1 self-end ${
        msg.sender === currentUserEmail
          ? "text-blue-200"
          : "text-gray-400"
      }`}
    >
      {new Date(msg.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  </div>
))}
            </div>
          ))
        )}
      </div>

      {/* Input Section */}
      <div className="p-2 sm:p-3 border-t bg-white flex items-center gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
