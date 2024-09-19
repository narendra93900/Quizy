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
    <div className="flex justify-between p-6 gap-8">
      {/* Left Side */}
      <SideBar />
      <div className="flex flex-1 flex-col">
        <h1 className="text-2xl font-bold">Quiz Participants</h1>
        {participantsWithScores.map(participant => (
          <div key={participant.userId} className="h-fit w-full border-b-2 flex items-center justify-between p-4">
            <p>{participant.userName}</p>
            <p>Score: {participant.score}</p>
            {participant.score === highestScore ? (
              <p className="p-2 rounded bg-green-500">Winner</p>
            ) : null}
            <button
              onClick={() => navigate(`/results/${quizId}/${participant.userId}`)}
              className="flex items-center justify-center gap-4 border-2 px-4 py-2 rounded-md text-white bg-indigo-500 shadow-indigo-500/50 hover:bg-white hover:text-indigo-500 hover:border-indigo-500 transition-all ease-in-out delay-150"
            >
              <p>View answers</p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Result;
