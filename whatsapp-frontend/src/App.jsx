import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import GoogleSignIn from './components/GoogleSignIn';

import ChatWindow from './components/ChatWindow';
import ChatWithInbox from './components/ChatWithInbox';


function AppRoutes() {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<GoogleSignIn />} />
      <Route path="/chatWindow" element={<ChatWindow />} />
      <Route path="/home" element={<ChatWithInbox />} />

     
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
