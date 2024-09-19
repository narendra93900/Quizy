import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import axios from 'axios';

// Sample quiz data
const QuizDetails = () => {
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [quizDetails, setQuizDetails] = useState();
  
  const {id} = useParams();
  

  useEffect(()=> {
    fetchQuizDetails(id)
  },[])

  const fetchQuizDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/quiz/${id}`);
      if(response.data){
        setQuizDetails(response.data)
        setUserAnswers(new Array(response.data.questions.length).fill(null))
      }
    } catch (error) {
      alert("failed to fetch quiz details")
    }
  }
  const handleOptionChange = (questionIndex, option) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    let wrongCount = 0;

    quizDetails.questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = question.options.find(option => option.text === userAnswer)?.isAnswer;
      if (isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
      }
    });

    setResults({ correct: correctCount, wrong: wrongCount });
    // Show confetti if all answers are correct
    if (correctCount === quizDetails.questions.length) {
      setShowConfetti(true);
    }
  };

  if (!quizDetails) return <div>Quiz not found.</div>;

  return (
    <div className="flex p-6">
    {/* Left Side */}
    <div className="h-screen min-w-72 flex flex-col items-start border-r-2">
      <img src="" alt="User Avatar" className="mb-4 w-24 h-24 rounded-full" />
      <p className="text-lg font-semibold">Username:</p>
      <p className="text-md mb-2">Password</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
    </div>
    <div className="p-6">
      {showConfetti && <Confetti />}
      <h1 className="text-2xl font-bold mb-4">{quizDetails.title}</h1>
      {quizDetails.questions.map((question, index) => (
        <div key={index} className="mb-4">
          <h2 className="font-semibold">{question.question}</h2>
          {question.options.map(option => (
            <div key={option.text}>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option.text}
                  onChange={() => handleOptionChange(index, option.text)}
                  className="mr-2"
                />
                {option.text}
              </label>
            </div>
          ))}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>

      {results && (
        <div className="mt-4">
          <h2 className="font-semibold">Results:</h2>
          <p>Correct Answers: {results.correct}</p>
          <p>Wrong Answers: {results.wrong}</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default QuizDetails;
