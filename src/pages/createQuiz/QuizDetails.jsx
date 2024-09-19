import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Confetti from "react-confetti";
import axios from "axios";
import SideBar from "../../components/SideBar";
import sadImage from '../../assets/sad.png';

// Sample quiz data
const QuizDetails = () => {
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [quizDetails, setQuizDetails] = useState();
  const [isAlreadyPArticipated, setIsAlreadyPArticipated] = useState(false);

  const { id, userId } = useParams();
  const navigate=useNavigate()

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
      const response = await axios.get(
        `http://localhost:5000/quizParticipants?id=${id}`
      );
      console.log(response)
      if (response.data) {
        const participants = response.data[0].participants;
        const isUserExists = participants.find((p) => p.userId === userId);

        if (isUserExists) {
          setIsAlreadyPArticipated(true);
        } else {
          setIsAlreadyPArticipated(false);
        }
      }
    } catch (error) {
      setIsAlreadyPArticipated(false);
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

      const response = await axios.post("http://localhost:5000/answers", {
        quizId: id,
        userId: userId,
        answers: userAnswers,
      });

      if (response.data) {
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

        const scoreResponse = await axios.post("http://localhost:5000/score", {
          userId: userId,
          quizId: id,
          score: score
        })

        setResults({ correct: correctCount, wrong: wrongCount, score });

        // Show confetti if all answers are correct
        if (correctCount === totalQuestions) {
          setShowConfetti(true);
        }

        const participantResponse = await axios.get(
          "http://localhost:5000/quizParticipants"
        );
        if (participantResponse.data) {
          const isQuizFound = participantResponse.data.find(
            (quiz) => quiz.id === id
          );
          if (isQuizFound) {
            await axios.put(`http://localhost:5000/quizParticipants/${id}`, {
              id: id,
              participants: [...isQuizFound.participants, {userId, userName}],
            });
          } else {
            await axios.post(`http://localhost:5000/quizParticipants`, {
              id: id,
              participants: [{userId, userName}],
            });
          }
        }
      navigate('/dashboard')
      }
    } catch (error) {
      alert("Failed to save answers!");
    }
  };

  if (!quizDetails) return <div>Quiz not found.</div>;

  if(isAlreadyPArticipated){
    return <div className="w-full h-screen flex flex-col items-center justify-center">
      <img src={sadImage} alt="sad image" className="w-96 h-auto object-contain"/>
      <p>You have already participated in this quiz...you cannot particiapte again.....</p>
      <button
        className="flex items-center justify-center gap-4 border-2 px-4 py-2 rounded-md text-white bg-indigo-500 shadow-indigo-500/50 hover:bg-white hover:text-indigo-500 hover:border-indigo-500 transition-all ease-in-out delay-150"
        onClick={() => navigate(`/results/${id}/${userId}`)}
      >
        View your answers
      </button>
    </div>

  }

  return (
    <div className="flex p-6">
      {/* Left Side */}
      <SideBar />
      <div className="p-6">
        {showConfetti && <Confetti />}
        <h1 className="text-2xl font-bold mb-4">{quizDetails.title}</h1>
        {quizDetails.questions.map((question, index) => (
          <div key={index} className="mb-4">
            <h2 className="font-semibold">{question.question}</h2>
            {question.options.map((option) => (
              <div key={option.text}>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option.text}
                    onChange={() =>
                      handleOptionChange(question.question, option.text)
                    }
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
            <p>Score: {results.score} out of 100</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizDetails;
