import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [conform, setConform] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading animation
    try {
      if (conform === password) {
        const response = await axios.post(`http://localhost:5000/user`, {
          username,
          password,
          isAdmin:false
        });
        if (response.data) {
          await localStorage.setItem("userId", response.data.id);
          await localStorage.setItem("isAdmin", response.data.isAdmin);
          await localStorage.setItem("username", response.data.username);
          alert("Register Successful!");
          navigate("/dashboard");
        }
      } else {
        alert("Passwords do not match");
      }
    } catch (error) {
      alert("Registration failed");
    } finally {
      setIsLoading(false); // Stop loading animation
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md transition-opacity duration-500">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={conform}
              onChange={(e) => setConform(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className={`px-4 py-2 text-white bg-blue-600 rounded-md transition duration-300 ease-in-out ${
                isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
