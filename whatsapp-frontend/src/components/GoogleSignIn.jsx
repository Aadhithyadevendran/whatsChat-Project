import React, { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function GoogleSignIn() {
  const navigate = useNavigate();

  const [googleUser, setGoogleUser] = useState(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await axios.post(`${BASE_URL}/api/user/upsert`, {
        firebaseUid: user.uid,
        name: user.displayName,
        email: user.email,
      });

      const res = await axios.get(
        `${BASE_URL}/api/user/search?email=${user.email}`
      );

      if (res.data && res.data.password) {
        navigate("/home");
      } else {
        setGoogleUser(user);
        setShowPasswordPrompt(true);
      }
    } catch (err) {
      console.error("Firebase login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async () => {
    if (!password.trim()) {
      alert("Please enter a password");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/auth/set-password`, {
        email: googleUser.email,
        password,
      });
      setPassword("");
      setShowPasswordPrompt(false);
      navigate("/home");
    } catch (err) {
      alert("Failed to set password: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!loginEmail.trim() || !loginPassword) {
      setLoginError("Please fill both fields");
      return;
    }
    setLoading(true);
    setLoginError("");
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: loginEmail,
        password: loginPassword,
      });
      if (res.data.success) {
        const userRes = await axios.get(
          `${BASE_URL}/api/user/search?email=${loginEmail}`
        );
        console.log(userRes.data);
        localStorage.setItem("user", JSON.stringify(userRes.data));
        navigate("/home");
      }
    } catch (err) {
      setLoginError("Login failed: Invalid Password or Email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-4 sm:p-6">
      <div
        className="bg-white shadow-lg rounded-lg p-4 sm:p-6 
                  w-[90%] max-w-xs   // mobile width reduced
                  sm:w-full sm:max-w-md lg:max-w-lg 
                  break-words"
      >
        <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800 leading-tight">
          Welcome to Whats-Chat
        </h1>
        {!googleUser && !showPasswordPrompt && (
          <>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center text-gray-700 leading-snug">
              Login with Email
            </h2>

            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 sm:px-4 sm:py-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 sm:px-4 sm:py-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            />
            {loginError && (
              <p className="text-red-600 mb-4 text-center font-medium text-sm sm:text-base">
                {loginError}
              </p>
            )}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="bg-green-600 text-white font-semibold px-5 py-2 sm:px-6 sm:py-3 rounded w-full mb-6 hover:bg-green-700 hover:scale-105 cursor-pointer disabled:opacity-50 transition duration-300 ease-in-out text-sm sm:text-base"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="text-center text-gray-500 font-semibold mb-6 text-sm sm:text-base">
              - OR -
            </div>

            <button
              onClick={handleSignIn}
              disabled={loading}
              className="bg-blue-600 text-white font-semibold px-5 py-2 sm:px-6 sm:py-3 rounded w-full hover:bg-blue-700 hover:scale-105 cursor-pointer disabled:opacity-50 transition duration-300 ease-in-out text-sm sm:text-base"
            >
              {loading ? "Signing in..." : "Sign in with Google"}
            </button>
          </>
        )}

        {showPasswordPrompt && googleUser && (
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center text-gray-700 leading-snug">
              Set a password
            </h2>
            <p className="mb-4 text-center text-gray-600 text-sm sm:text-base">
              For future logins, set a password for your account (
              <span className="font-medium">{googleUser.email}</span>)
            </p>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 sm:px-4 sm:py-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            />
            <button
              onClick={handleSetPassword}
              disabled={loading}
              className="bg-blue-600 text-white font-semibold px-5 py-2 sm:px-6 sm:py-3 rounded w-full hover:bg-blue-700 hover:scale-105 cursor-pointer disabled:opacity-50 transition duration-300 ease-in-out text-sm sm:text-base"
            >
              {loading ? "Saving..." : "Save Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
