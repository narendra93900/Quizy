import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [conform, setConform] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (conform === password) {
        const response = await axios.post(`http://localhost:5000/user`, {
          username,
          password,
        });
        // console.log(response);
        if (response.data) {
          await localStorage.setItem("userId", response.data.id);
          navigate("/dashboard");
          alert("Register Successful!");
        }
      } else {
        alert("Password don't matched");
      }
      const response = await axios.get(`http://localhost:5000/user`);
      // console.log(response);

      const validUser = response.data.find(
        (user) => user.username === username && user.password === password
      );
      //   if (validUser) {
      //     await localStorage.setItem("userId",validUser.id)
      //     // alert("Login Successful!");
      //     navigate('/dashboard')
      //   } else {
      //     alert("Incorrect Username or Password");
      //     navigate("/register");
      //   }
    } catch (error) {
      //   console.error("Error during login:", error);
      alert("Register failed");
    }
  };

  return (
    <div className="relative min-h-screen flex">
      <img
        src={"../../assets/Limg.png"}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="relative w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Conform Password
              </label>
              <input
                type="password"
                placeholder="conform password"
                value={conform}
                onChange={(e) => setConform(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
