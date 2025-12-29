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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 p-2 sm:p-4">
      <div className="w-full max-w-4xl h-[90vh] sm:h-[80vh] bg-white rounded-xl shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b bg-white rounded-t-xl">
          <h2 className="text-sm sm:text-lg font-semibold text-gray-800 truncate">
            💬 Chat with <span className="text-blue-600">{targetName}</span>
          </h2>
          <button
            className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-xs sm:text-sm"
            onClick={() => navigate("/home")}
          >
            🔙 Back
          </button>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-hidden">
          <DirectChat targetEmail={targetEmail} />
        </div>
      </div>
    </div>
  );
}
