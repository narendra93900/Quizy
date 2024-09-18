import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import backgroundImage from '../assets/backgroundImage.png';

const Landing = () => {
  const [isConfettiVisible, setConfettiVisible] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setConfettiVisible(true);
    setTimeout(() => {
      navigate('/login'); // Navigate to the login page after the confetti animation
    }, 3000); // duration of the confetti animation
  };

  return (
    <div className="relative h-screen flex items-center justify-start w-100% ">
      {isConfettiVisible && <Confetti />}
      <img
        src={backgroundImage}
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* Overlay to dim the background image */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div> */}

      <div className="relative z-20 text-white pl-12 max-w-md">
        <h1 className="text-5xl font-bold mb-6">Welcome to Quiz</h1>
        <p className="text-xl mb-8">
          7 Little Changes That'll Make a Big Difference With Your Mental Health
        </p>
        <button
          onClick={handleGetStarted}
          className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-300 transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Landing;
