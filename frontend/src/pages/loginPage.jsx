import React , { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();
  
  async function handleSubmit(e) {
    e.preventDefault();

    try{
      const userData={
        email,
        password
      }
      console.log("this is userData -> ",userData)
  
      const response = await axios.post("http://localhost:5000/api/users/login",userData);
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('userId', response.data.user._id)
        console.log(localStorage.getItem("userId"));
        console.log(response.data.user.name)
        navigate("/",{state:{name:response.data.user.name}}); 
      }
    }
    catch(err){
      console.log("this is the error -> ",err);
      console.log("login failed")
    }
  
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login
