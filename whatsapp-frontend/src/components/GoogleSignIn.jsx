import React, { useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

      await axios.post("http://localhost:8000/api/user/upsert", {
        firebaseUid: user.uid,
        name: user.displayName,
        email: user.email,
      });

      const res = await axios.get(
        `http://localhost:8000/api/user/search?email=${user.email}`
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
      await axios.post("http://localhost:8000/api/auth/set-password", {
        email: googleUser.email,
        password,
      });
      setPassword(""); // Clear password field
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
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });
      if (res.data.success) {
        navigate("/home");
      } else {
        setLoginError("Invalid email or password");
      }
    } catch (err) {
      setLoginError("Login failed: Invalid Password or Email");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Welcome to Whats-Chat
        </h1>

        {/* Email Login Section */}
        {!googleUser && !showPasswordPrompt && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
              Login with Email & Password
            </h2>

            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="border border-gray-300 rounded px-4 py-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="border border-gray-300 rounded px-4 py-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {loginError && (
              <p className="text-red-600 mb-4 text-center font-medium">
                {loginError}
              </p>
            )}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="bg-green-600 text-white font-semibold px-6 py-3 rounded w-full mb-6
             hover:bg-green-700 hover:scale-105 cursor-pointer
             disabled:opacity-50 transition duration-300 ease-in-out"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="text-center text-gray-500 font-semibold mb-6">
              - OR -
            </div>

            {/* Google Sign-In button */}
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded w-full
             hover:bg-blue-700 hover:scale-105 cursor-pointer
             disabled:opacity-50 transition duration-300 ease-in-out"
            >
              {loading ? "Signing in..." : "Sign in with Google"}
            </button>
          </>
        )}

        {/* Password set prompt */}
        {showPasswordPrompt && googleUser && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
              Set a password
            </h2>
            <p className="mb-4 text-center text-gray-600">
              For future logins, set a password for your account (
              <span className="font-medium">{googleUser.email}</span>)
            </p>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded px-4 py-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSetPassword}
              disabled={loading}
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded w-full
             hover:bg-blue-700 hover:scale-105 cursor-pointer
             disabled:opacity-50 transition duration-300 ease-in-out"
            >
              {loading ? "Saving..." : "Save Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
