//MADE AS SEPARATE COMPONENT NOW MERGED


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { auth } from "../firebase";
// import { useSearchParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// export default function Chat() {
//   const [searchEmail, setSearchEmail] = useState("");
//   const [targetUser, setTargetUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMsg, setNewMsg] = useState("");
//   const [loadingChat, setLoadingChat] = useState(false);
//   const navigate = useNavigate();

//   const currentUserEmail = auth.currentUser?.email;
//   const [params] = useSearchParams();
//   const urlTarget = params.get("target");

//   useEffect(() => {
//     const fetchUserAndMessages = async () => {
//       if (urlTarget) {
//         try {
//           const res = await axios.get(
//             `http://localhost:8000/api/user/search?email=${urlTarget}`
//           );
//           if (res.data) {
//             setTargetUser(res.data);
//             setSearchEmail(urlTarget);
//             await loadMessages(currentUserEmail, urlTarget);
//           }
//         } catch (err) {
//           console.error("Failed to load user from URL:", err);
//         }
//       }
//     };

//     fetchUserAndMessages();
//   }, [urlTarget, currentUserEmail]);

//   const searchUser = async () => {
//     try {
//       const res = await axios.get(
//         `http://localhost:8000/api/user/search?email=${searchEmail}`
//       );
//       if (res.data) {
//         setTargetUser(res.data);
//         loadMessages(currentUserEmail, searchEmail);
//       } else {
//         alert("User not found.");
//         setTargetUser(null);
//         setMessages([]);
//       }
//     } catch (err) {
//       console.error("Search error:", err);
//     }
//   };

//   const loadMessages = async (user1, user2) => {
//     try {
//       setLoadingChat(true);
//       const res = await axios.get(
//         `http://localhost:8000/api/chat/messages?user1=${user1}&user2=${user2}`
//       );
//       setMessages(res.data.messages || []);
//     } catch (err) {
//       console.error("Load messages error:", err);
//     } finally {
//       setLoadingChat(false);
//     }
//   };

//   const sendMessage = async () => {
//     if (!newMsg.trim()) return;

//     try {
//       await axios.post("http://localhost:8000/api/chat/send", {
//         sender: currentUserEmail,
//         receiver: searchEmail,
//         text: newMsg,
//       });
//       setNewMsg("");
//       loadMessages(currentUserEmail, searchEmail);
//     } catch (err) {
//       console.error("Send error:", err);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen text-gray-900">
//       <h2 className="text-2xl font-bold mb-4">Chat With Users</h2>
//       <div className="flex space-x-2 mb-4">
//         <input
//           type="email"
//           value={searchEmail}
//           onChange={(e) => setSearchEmail(e.target.value)}
//           placeholder="Enter user email..."
//           className="border px-4 py-2 rounded w-64 text-gray-800 placeholder-gray-500 bg-white"
//         />
//         <button
//           onClick={searchUser}
//           className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black"
//         >
//           Search
//         </button>
//       </div>

//       {targetUser && (
//         <div
//           className="bg-white rounded-2xl shadow-md p-4 mb-4 max-w-xl cursor-pointer hover:shadow-lg transition"
//           onClick={() =>
//             navigate("/chatWindow", {
//               state: { targetEmail: targetUser.email },
//             })
//           }
//         >
//           <p className="text-lg font-semibold text-blue-700">
//             {targetUser.name}
//           </p>
//           <p className="text-gray-700">{targetUser.email}</p>
//         </div>
//       )}
//     </div>
//   );
// }
