import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import RequestApp from "./pages/RequestApp";

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<RequestApp />} />
        <Route path="/chat" element={<Chat />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
      </Routes>
    
  );
}

export default App;
