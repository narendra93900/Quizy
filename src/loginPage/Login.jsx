import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Limg from "../assets/Limg.png";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/user`);
      const validUser = response.data.users.find(
        (user) => user.username === username && user.password === password
      );
      if (validUser) {
        alert("Login Successful!");
      } else {
        alert("Incorrect Username or Password");
        navigate("/register");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="relative min-h-screen flex">
      <img
        src={Limg}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />

{/* <div className="absolute top-0 right-0 p-4  bg-opacity-60 rounded-bl-lg ">
        <div className="text-5xl font-semibold text-slate-50 ">Welcome</div>
        <div className="text-lg font-semibold text-slate-50  ">
          Join Our Little Platfrom to Sharp Your Mind
        </div>

        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700"
          onClick={() => navigate("/Register")}
        >
          Register
        </button>
      </div> */}

      <div className="flex flex-1 items-center justify-center p-8">
        <div className="relative w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6">LOGIN</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {/* <button
                type="button"
                className="px-4 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-700"
                onClick={() => navigate("/admin")}
              >
                Admin
              </button> */}
            </div>
          </form>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-end p-8">
        <div className="text-5xl font-semibold text-slate-50">Welcome</div>
        <div className="text-lg font-semibold text-slate-50">
          Join Our Little Platform to Sharpen Your Mind
        </div>
        <button
          type="button"
          className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
