import React from "react";
import DirectChat from "./DirectChat";
import { useLocation, useNavigate } from "react-router-dom";

export default function ChatWindow() {
  const location = useLocation();
  const navigate = useNavigate();
const targetEmail = location.state?.targetEmail;
const targetName = location.state?.targetName || targetEmail;

  if (!targetEmail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
        <p className="text-xl font-semibold text-red-500 mb-4">
          ❌ No user selected for chat.
        </p>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          onClick={() => navigate("/home")}
        >
          🔙 Back to Inbox
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 p-4">
      <div className="w-full max-w-4xl h-[80vh] bg-white rounded-xl shadow-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white rounded-t-xl">
          <h2 className="text-lg font-semibold text-gray-800">
            💬 Chat with <span className="text-blue-600">{targetName}</span>
          </h2>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            onClick={() => navigate("/home")}
          >
            🔙 Back
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <DirectChat targetEmail={targetEmail} />
        </div>
      </div>
    </div>
  );
}
