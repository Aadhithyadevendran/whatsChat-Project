import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function ChatWithInbox() {
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const localUser = JSON.parse(localStorage.getItem("user"));
      if (localUser) {
        console.log(localUser);
        setCurrentUserEmail(localUser.email);
        console.log(localUser.email);
      } else if (user) setCurrentUserEmail(user.email);
      else setCurrentUserEmail(null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUserEmail) return;
    if (!searchedUser) {
      axios
        .get(`${BASE_URL}/api/chat/inbox?email=${currentUserEmail}`)
        .then((res) => setInbox(res.data))
        .catch((err) => console.error("Error loading inbox:", err));
    }
  }, [currentUserEmail, searchedUser]);

  const searchUser = async () => {
    if (!searchEmail.trim()) {
      setSearchedUser(null);
      return;
    }
    if (searchEmail.toLowerCase() === currentUserEmail?.toLowerCase()) {
      setSearchedUser("self");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/api/user/search?email=${searchEmail}`
      );
      if (res.data) setSearchedUser(res.data);
      else {
        alert("User not found.");
        setSearchedUser(null);
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchedUser(null);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("user");
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center p-4 sm:p-6 relative">
      {/* Header with responsive layout */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h1 className="w-full text-xl sm:text-3xl font-extrabold text-blue-800 text-center">
          Chat With Your Friends
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-red-700 transition cursor-pointer text-xs sm:text-base self-center sm:self-auto"
        >
          Logout
        </button>
      </div>

      {/* Search input */}
      <div className="flex flex-col sm:flex-row w-full max-w-md sm:max-w-3xl mb-6 space-y-3 sm:space-y-0 sm:space-x-3">
        <input
          type="email"
          placeholder="Search for your friends..."
          className="flex-grow border border-blue-300 rounded-lg px-4 py-2 sm:py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchUser()}
          disabled={loading}
        />
        <button
          onClick={searchUser}
          disabled={loading}
          className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          Search
        </button>
      </div>

      {/* Searched user card */}
      {searchedUser === "self" ? (
        <p className="text-red-600 font-semibold mb-6 text-center text-sm sm:text-base">
          Don't type your own email 😉
        </p>
      ) : searchedUser ? (
        <div
          className="cursor-pointer border border-blue-400 rounded-lg p-4 sm:p-5 mb-6 bg-white shadow hover:shadow-lg transition w-full max-w-md sm:max-w-lg"
          onClick={() =>
            navigate("/chatWindow", {
              state: {
                targetEmail: searchedUser.email,
                targetName: searchedUser.name,
              },
            })
          }
        >
          <p className="text-base sm:text-xl font-semibold text-blue-700">
            {searchedUser.name}
          </p>
          <p className="text-gray-700 text-xs sm:text-base">
            {searchedUser.email}
          </p>
          <p className="text-[10px] sm:text-sm text-gray-500 mt-1">
            Click to open chat
          </p>
        </div>
      ) : null}

      {/* Inbox */}
      {!searchedUser && (
        <div className="w-full max-w-md sm:max-w-3xl bg-white rounded-lg shadow border border-gray-200 p-4 sm:p-6">
          <h2 className="text-base sm:text-2xl font-bold mb-4 text-gray-700">
            📥 Your Inbox
          </h2>

          {inbox.length === 0 ? (
            <p className="text-gray-500 text-sm sm:text-base">No chats yet.</p>
          ) : (
            <ul className="space-y-3 sm:space-y-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
              {inbox.map((item) => (
                <li
                  key={item.with}
                  className="cursor-pointer p-3 sm:p-4 rounded-lg shadow hover:shadow-lg bg-gray-50 transition"
                  onClick={() =>
                    navigate("/chatWindow", {
                      state: { targetEmail: item.with, targetName: item.name },
                    })
                  }
                >
                  <p className="font-semibold text-blue-700 text-sm sm:text-base">
                    {item.name}
                  </p>
                  <p className="truncate text-xs sm:text-sm">
                    {item.lastMessage}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
