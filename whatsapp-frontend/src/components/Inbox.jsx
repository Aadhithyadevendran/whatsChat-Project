//MADE AS SEPARATE COMPONENT NOW MERGED


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../firebase';
// import { useNavigate } from "react-router-dom";

// function Inbox() {
//   const [email, setEmail] = useState(null);
//   const [inbox, setInbox] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setEmail(user.email);
//       } else {
//         console.log("❌ Not signed in");
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (!email) return;
//     console.log("📨 Loading inbox for email:", email);

//     axios
//       .get(`http://localhost:8000/api/chat/inbox?email=${email}`)
//       .then((res) => setInbox(res.data))
//       .catch((err) => console.error("❌ Error loading inbox:", err));
//   }, [email]);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">📥 Your Inbox</h2>

//       {!email && <p className="text-gray-500">Loading user...</p>}
//       {email && inbox.length === 0 && <p className="text-gray-500">No chats yet.</p>}

//       {email && inbox.length > 0 && (
//         <ul className="w-full max-w-2xl space-y-4">
//           {inbox.map((item, index) => (
//             <li
//               key={index}
//               className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition cursor-pointer"
//               onClick={() => navigate("/chatWindow", { state: { targetEmail: item.with } })}
//             >
//               <p className="text-lg font-semibold text-blue-700">{item.name}</p>
//               <p className="text-gray-700 truncate">{item.lastMessage}</p>
//               <p className="text-xs text-gray-400 mt-1">
//                 {new Date(item.timestamp).toLocaleString()}
//               </p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default Inbox;
