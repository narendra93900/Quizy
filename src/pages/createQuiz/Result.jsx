import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../../components/SideBar";
import axios from "axios";

const Result = () => {
  const { quizId } = useParams();
  const [results, setResults] = useState([]);
  const [quizParticipants, setQuizParticipants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizParticipants();
    fetchQuizAnswers();
    fetchQuizScores();
  }, []);

  const fetchQuizAnswers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/answers/${quizId}`);
      if (response.data) {
        setResults(response.data);
      }
    } catch (error) {
      console.error("Error fetching quiz answers:", error);
    }
  };

  const fetchQuizScores = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/score`, {
        params: { quizId },
      });
      if (response.data) {
        setResults(prevResults => [...prevResults, ...response.data]);
      }
    } catch (error) {
      console.error("Error fetching quiz scores:", error);
    }
  };

  const fetchQuizParticipants = async () => {
    try {
      const participantResponse = await axios.get(
        `http://localhost:5000/quizParticipants/${quizId}`
      );
      if (participantResponse.data) {
        setQuizParticipants(participantResponse.data?.participants);
      }
    } catch (error) {
      console.error("Error fetching quiz participants:", error);
    }
  };

  // Combine and sort participants by score
  const participantsWithScores = quizParticipants.map(participant => {
    const scoreObj = results.find(res => res.userId === participant.userId);
    return {
      ...participant,
      score: scoreObj ? scoreObj.score : 0, // Default to 0 if no score found
    };
  }).sort((a, b) => b.score - a.score); // Sort by score in descending order

  const highestScore = participantsWithScores.length > 0 ? participantsWithScores[0].score : 0;

  return (
    <div className="flex justify-between p-6 gap-8 bg-gray-100 min-h-screen">
      {/* Left Side */}
      <SideBar />
      <div className="flex-1 flex flex-col p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Quiz Participants</h1>
        <div className="overflow-y-auto max-h-[70vh]">
          {participantsWithScores.length > 0 ? (
            participantsWithScores.map(participant => (
              <div key={participant.userId} className="flex items-center justify-between border-b-2 border-gray-200 p-4 hover:bg-gray-50 transition duration-150 ease-in-out">
                <p className="text-lg font-medium">{participant.userName}</p>
                <p className="text-lg font-medium">Score: {participant.score}</p>
                {participant.score === highestScore && (
                  <span className="p-2 rounded bg-green-500 text-white">Winner</span>
                )}
                <button
                  onClick={() => navigate(`/results/${quizId}/${participant.userId}`)}
                  className="ml-4 flex items-center justify-center gap-2 border-2 border-indigo-500 px-4 py-2 rounded-md text-indigo-500 bg-white shadow transition duration-150 ease-in-out hover:bg-indigo-500 hover:text-white"
                >
                  <p>View answers</p>
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center p-4">No participants available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
