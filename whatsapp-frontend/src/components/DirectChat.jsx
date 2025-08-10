// src/components/DirectChat.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

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
  }, 4000); // every 2 seconds

  return () => clearInterval(interval);
}, [currentUserEmail, targetEmail]);

  const fetchMessages = async (user1, user2) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/chat/messages?user1=${user1}&user2=${user2}`
      );
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("❌ Error fetching messages:", err);
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    try {
      await axios.post("http://localhost:8000/api/chat/send", {
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 bg-gray-100 space-y-2">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet.</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[75%] p-3 rounded-lg shadow-md text-sm whitespace-pre-wrap ${
                msg.sender === currentUserEmail
                  ? "ml-auto bg-blue-500 text-white"
                  : "mr-auto bg-white text-black"
              }`}
            >
              <p>{msg.text}</p>
              <p className="text-[10px] text-right text-gray-300 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t bg-white flex items-center gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
