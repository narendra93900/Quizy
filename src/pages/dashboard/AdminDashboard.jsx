import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const AdminDashboard = () => {
    const navigate = useNavigate()
    const [quizes,setQuizes]=useState()
    useEffect(() => {
        fetchQuizs()
      
    }, [])
    const fetchQuizs = async (e) => {
       try {
       const response = await axios.get(`http://localhost:5000/quiz`)
        // console.log(response)
        setQuizes(response.data)
       
       } catch (error) {
        console.error(error);
       }
    }

  return (
    <div className="flex justify-between p-6">
      {/* Left Side */}
      <div className="flex flex-col items-start">
        <img src="" alt="User Avatar" className="mb-4 w-24 h-24 rounded-full" />
        <p className="text-lg font-semibold">Username:</p>
        <p className="text-md mb-2">Password</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
      </div>

      {/* Right Side */}
      
        {quizes && quizes.length? <div className="flex flex-col justify-center items-center">

            <button className="bg-green-500 text-white px-4 py-2 mb-2 rounded">Create Quiz</button>
            {/* <button className="bg-yellow-500 text-white px-4 py-2 rounded">Show Result</button> */}
        </div>
        : <div className='h-screen w-screen flex items-center justify-center'>
        <button className='bg-green-500 text-white flex items-center justify-center p-2 rounded-md' onClick={()=>navigate("/createquiz")}>Create Quiz</button>
        </div>}
      </div>
    
  );
};

export default AdminDashboard;
