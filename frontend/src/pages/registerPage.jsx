import React,{ useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import io from "socket.io-client";
const RegisterPage = () => {
  const navigate = useNavigate();
  const [FormData , setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })

  const handleSubmit = async(e)=>{
    e.preventDefault();

    try{
      const response = await axios.post("http://localhost:5000/api/users/register",FormData);
      console.log("this is response status -> ",response.status)
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token)
        console.log("registration successful");

        const socket = io("http://localhost:5000");

        const userId = response.data.newUser._id;
        // console.log("this is response data id ",response.data.newUser._id)

        console.log("this is userId -> ",userId)
        socket.emit("register", userId);
        navigate("/login");
      }

    }
    catch(err){
      console.log("this is the error -> ",err);
      console.log("registration failed")
    }

  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="name"
        value={FormData.name}
        onChange={(e) => setFormData({ ...FormData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={FormData.email}
        onChange={(e) => setFormData({ ...FormData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={FormData.password}
        onChange={(e) => setFormData({ ...FormData, password: e.target.value })}
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterPage
