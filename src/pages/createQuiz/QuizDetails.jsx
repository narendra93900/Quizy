import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Confetti from "react-confetti";
import axios from "axios";
import SideBar from "../../components/SideBar";
import sadImage from '../../assets/sad.png';

const QuizDetails = () => {
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [quizDetails, setQuizDetails] = useState();
  const [isAlreadyParticipated, setIsAlreadyParticipated] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { id, userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    isUserAlreadyParticipated();
    fetchQuizDetails(id);
  }, [id]);

  const fetchQuizDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/quiz/${id}`);
      if (response.data) {
        setQuizDetails(response.data);

        let questionAnswerFormat = {};
        response.data.questions.forEach((question) => {
          questionAnswerFormat[question.question] = null;
        });

        setUserAnswers(questionAnswerFormat);
      }
    } catch (error) {
      alert("Failed to fetch quiz details");
    }
  };

  const isUserAlreadyParticipated = async () => {
    try {
      const userId = await localStorage.getItem("userId");
      const response = await axios.get(`http://localhost:5000/quizParticipants?id=${id}`);
      if (response.data) {
        const participants = response.data[0].participants;
        const isUserExists = participants.find((p) => p.userId === userId);

        setIsAlreadyParticipated(isUserExists);
      }
    } catch (error) {
      setIsAlreadyParticipated(false);
    }
  };

  const handleOptionChange = (question, option) => {
    const updatedAnswers = { ...userAnswers, [question]: option };
    setUserAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    try {
      let correctCount = 0;
      let wrongCount = 0;
      const userId = localStorage.getItem("userId");
      const userName = localStorage.getItem("username");

      await axios.post("http://localhost:5000/answers", {
        quizId: id,
        userId: userId,
        answers: userAnswers,
      });

      quizDetails.questions.forEach((question) => {
        const userAnswer = userAnswers[question.question];
        const isCorrect = question.options.find(
          (option) => option.text === userAnswer
        )?.isAnswer;
        if (isCorrect) {
          correctCount++;
        } else {
          wrongCount++;
        }
      });

      const totalQuestions = quizDetails.questions.length;
      const score = Math.round((correctCount / totalQuestions) * 100);

      await axios.post("http://localhost:5000/score", {
        userId: userId,
        quizId: id,
        score: score
      });

      setResults({ correct: correctCount, wrong: wrongCount, score });

      // Show confetti if all answers are correct
      if (correctCount === totalQuestions) {
        setShowConfetti(true);
      }

      const participantResponse = await axios.get("http://localhost:5000/quizParticipants");
      if (participantResponse.data) {
        const isQuizFound = participantResponse.data.find((quiz) => quiz.id === id);
        if (isQuizFound) {
          await axios.put(`http://localhost:5000/quizParticipants/${id}`, {
            id: id,
            participants: [...isQuizFound.participants, { userId, userName }],
          });
        } else {
          await axios.post(`http://localhost:5000/quizParticipants`, {
            id: id,
            participants: [{ userId, userName }],
          });
        }
      }

      // Redirect to results page after submitting
      navigate(`/dashboard`);
    } catch (error) {
      alert("Failed to save answers!");
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizDetails.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (!quizDetails) return <div>Quiz not found.</div>;

  if (isAlreadyParticipated) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <img src={sadImage} alt="sad image" className="w-96 h-auto object-contain" />
        <p>You have already participated in this quiz...you cannot participate again.....</p>
        <button
          className="flex items-center justify-center gap-4 border-2 px-4 py-2 rounded-md text-white bg-indigo-500 shadow-indigo-500/50 hover:bg-white hover:text-indigo-500 hover:border-indigo-500 transition-all ease-in-out delay-150"
          onClick={() => navigate(`/results/${id}/${userId}`)}
        >
          View your answers
        </button>
      </div>
    );
  }

  const currentQuestion = quizDetails.questions[currentQuestionIndex];

  return (
    <div className="flex p-6">
      <SideBar />
      <div className="p-6 flex-grow">
        {showConfetti && <Confetti />}
        <h1 className="text-2xl font-bold mb-4">{quizDetails.title}</h1>
        <h2 className="font-semibold mb-2">{`Question ${currentQuestionIndex + 1} of ${quizDetails.questions.length}`}</h2>
        
        <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
          <h3 className="font-semibold mb-4">{currentQuestion.question}</h3>
          {currentQuestion.options.map((option) => (
            <div key={option.text} className="mb-2">
              <label className={`flex items-center border rounded-lg p-2 ${userAnswers[currentQuestion.question] === option.text ? "bg-blue-100" : "bg-gray-100"} hover:bg-gray-200 transition-all`}>
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={option.text}
                  checked={userAnswers[currentQuestion.question] === option.text}
                  onChange={() => handleOptionChange(currentQuestion.question, option.text)}
                  className="mr-2"
                />
                {option.text}
              </label>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mb-4">
          <button
            onClick={handlePrev}
            className="bg-gray-300 text-black px-4 py-2 rounded"
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          {currentQuestionIndex === quizDetails.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Next
            </button>
          )}
        </div>

        {results && (
          <div className="mt-4">
            <h2 className="font-semibold">Results:</h2>
            <p>Correct Answers: {results.correct}</p>
            <p>Wrong Answers: {results.wrong}</p>
            <p>Score: {results.score} out of 100</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizDetails;
