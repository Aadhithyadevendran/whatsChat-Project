//MADE AS SEPARATE COMPONENT NOW MERGED

// import React, { useState } from "react";
// import Chat from "./Chat";
// import Inbox from "./Inbox";

// export default function Home() {
//   const [searchedUserEmail, setSearchedUserEmail] = useState(null);

//   return (
//     <div className="flex flex-col h-screen p-4 bg-gray-50 max-w-3xl mx-auto">
//       {/* Chat - limited height */}
//       <div className="mb-4 max-h-60 border p-2 overflow-auto bg-white rounded">
//         <Chat onSearch={(email) => setSearchedUserEmail(email)} />
//       </div>

//       {/* Inbox - takes remaining space */}
//       <div
//         className={`flex-1 border p-2 overflow-auto rounded bg-white ${
//           searchedUserEmail
//             ? "opacity-50 pointer-events-none"
//             : "opacity-100"
//         }`}
//       >
//         <Inbox />
//       </div>
//     </div>
//   );
// }

