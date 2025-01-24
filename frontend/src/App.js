import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import RequestApp from "./pages/RequestApp";
import PendingRequests from "./components/PendingRequest";
import SendRequests from "./components/SendingRequest";

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/request" element={<RequestApp />} />
        <Route path="/chat" element={<Chat />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path="/pending-requests" element={<PendingRequests />} />
        <Route path="/send-requests" element={<SendRequests />} />  
      </Routes>
    
  );
}

export default App;
