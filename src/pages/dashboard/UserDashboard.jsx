import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/SideBar";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [quizes, setQuizes] = useState([]);
  useEffect(() => {
    fetchQuizs();
  }, []);
  const fetchQuizs = async (e) => {
    try {
      const response = await axios.get(`http://localhost:5000/quiz`);
      // console.log(response)
      setQuizes(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex justify-between p-6">
      {/* Left Side */}
     <SideBar/>

      {/* Right Side: Cards */}
      {quizes.map((quiz, index) => (
        <div
          className="w-2/3 grid grid-cols-1 h-fit md:grid-cols-2 gap-4"
          key={index}
          onClick={() =>
            navigate("/quizdetails", { state: { quizDetails: quiz } })
          }
        >
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="font-bold text-xl mb-2">{quiz.title}</h2>
            <p className="text-gray-700">
              No of Questions: {quiz.questions.length}
            </p>
            <button className="bg-blue-500 text-white mt-2 px-4 py-1 rounded">
              Attend
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserDashboard;
