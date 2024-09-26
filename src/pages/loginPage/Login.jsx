import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/user`);
      
      const validUser = response.data.find(
        (user) => user.username === username && user.password === password
      );
      if (validUser) {
        await localStorage.setItem("userId", validUser.id);
        await localStorage.setItem("isAdmin", validUser.isAdmin);
        await localStorage.setItem("username", validUser.username);
        
        navigate(validUser.isAdmin ? "/dashboard" : "/dashboard");
      } else {
        alert("Incorrect Username or Password");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              placeholder="Enter Your username"
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
              placeholder="Enter Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="w-full text-white bg-indigo-600 px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-indigo-700 hover:shadow-lg"
            >
              Submit
            </button>
          </div>
          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-indigo-600 hover:underline"
              onClick={() => navigate("/register")}
            >
              Don’t have an account? Register here
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
