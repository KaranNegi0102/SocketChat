import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
// import RequestApp from "./pages/RequestApp";
import PendingRequests from "./components/PendingRequest";
import SendRequests from "./components/SendingRequest";
import LandingPage from "./pages/BeforeHome";
import ProfilePage from "./pages/Profile";
import FriendList from "./pages/FriendList";
function App() {
  return (
    
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path="/pending-requests" element={<PendingRequests />} />
        <Route path="/send-requests" element={<SendRequests />} /> 
        <Route path="/profile" element={<ProfilePage />} /> 
        <Route path="/remove-friend" element={<FriendList/>} ></Route>
      </Routes>
  );
}

export default App;
