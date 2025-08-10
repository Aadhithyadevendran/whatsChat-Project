import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function ChatWithInbox() {
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUserEmail(user.email);
      else setCurrentUserEmail(null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUserEmail) return;
    if (!searchedUser) {
      axios
        .get(`http://localhost:8000/api/chat/inbox?email=${currentUserEmail}`)
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
        `http://localhost:8000/api/user/search?email=${searchEmail}`
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
      await signOut(auth);
      navigate("/");  // Redirect to frontpage/login
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center p-6 relative">
      {/* Logout button top-right */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition cursor-pointer select-none"
      >
        Logout
      </button>

      {/* Heading */}
      <h1 className="text-3xl font-extrabold text-blue-800 mb-6 select-none">
        Chat With Your Friends
      </h1>

      {/* Search input */}
      <div className="flex w-full max-w-3xl mb-6 space-x-3">
        <input
          type="email"
          placeholder="Search for your friends..."
          className="flex-grow border border-blue-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchUser()}
          disabled={loading}
        />
        <button
          onClick={searchUser}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Search
        </button>
      </div>

      {/* Searched user card */}
      {searchedUser === "self" ? (
        <p className="text-red-600 font-semibold mb-6 select-none">
          Don't type your email bro
        </p>
      ) : searchedUser ? (
        <div
          className="cursor-pointer border border-blue-400 rounded-lg p-5 mb-6 bg-white shadow hover:shadow-lg transition"
          onClick={() =>
            navigate("/chatWindow", {
              state: { targetEmail: searchedUser.email, targetName: searchedUser.name },
            })
          }
        >
          <p className="text-xl font-semibold text-blue-700">{searchedUser.name}</p>
          <p className="text-gray-700">{searchedUser.email}</p>
          <p className="text-sm text-gray-500 mt-1">Click to open chat</p>
        </div>
      ) : null}

      {/* Inbox */}
      {!searchedUser && (
        <div className="w-full max-w-3xl bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-700 select-none">📥 Your Inbox</h2>

          {inbox.length === 0 ? (
            <p className="text-gray-500 select-none">No chats yet.</p>
          ) : (
            <ul className="space-y-4 max-h-[60vh] overflow-y-auto">
              {inbox.map((item) => (
                <li
                  key={item.with}
                  className="cursor-pointer p-4 rounded-lg shadow hover:shadow-lg bg-gray-50 transition"
                  onClick={() =>
                    navigate("/chatWindow", {
                      state: { targetEmail: item.with, targetName: item.name },
                    })
                  }
                >
                  <p className="font-semibold text-blue-700">{item.name}</p>
                  <p className="truncate">{item.lastMessage}</p>
                  <p className="text-xs text-gray-400 mt-1 select-none">
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
