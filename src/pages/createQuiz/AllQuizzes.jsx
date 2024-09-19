import { useEffect, useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import axios from "axios";
import {useNavigate, useParams } from "react-router-dom";

const AllQuizzes = () => {
  const navigate = useNavigate();
  const {language} = useParams();
  const [quizes, setQuizes] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    fetchQuizs();
  }, []);
  const fetchQuizs = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/quiz`, {
        params: {
          language: language,
        }
      });

      const admin = await JSON.parse(localStorage.getItem('isAdmin'));

      // console.log(response)
      setQuizes(response.data);
      await setIsAdmin(admin)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-between p-6 gap-8">
      {/* Left Side */}
      <div className="h-screen min-w-72 flex flex-col items-start border-r-2">
        <img src="" alt="User Avatar" className="mb-4 w-24 h-24 rounded-full" />
        <p className="text-lg font-semibold">Username:</p>
        <p className="text-md mb-2">Password</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Edit
        </button>
      </div>

      {/* Right Side */}

      {quizes && quizes.length ? (
        <div className="flex-col flex-1 p-10">
            <div className="w-full flex items-center justify-between">
          <h1 className="text-4xl font-bold">All Quizzes</h1>
          
          {isAdmin ? <button className="text-white bg-indigo-500 px-4 py-2 rounded-md" onClick={()=> navigate(`/createquiz/${language}`)}>Create Quiz</button>: <></>}
          </div>
          <div className="w-full h-full grid gap-8 grid-flow-col auto-cols-max mt-12">
            {quizes.map((quiz) => (
              <div
                key={quiz._id}
                className="h-fit mb-4 min-w-80 border-2 p-8 rounded-md shadow-lg cursor-pointer hover:shadow-2xl transition-all ease-in-out delay-150"
                onClick={() => navigate(`/quizdetails/${quiz?.id}`)}
              >
                <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>
                <p className="text-gray-400 mb-4">
                  Total Questions: {quiz.questions.length}
                </p>
                <button
                  onClick={() => navigate(`/quizdetails/${quiz.id}`)}
                  className="mt-8 flex items-center justify-center gap-4 border-2 px-4 py-2 rounded-md text-white bg-indigo-500 shadow-indigo-500/50 hover:bg-white hover:text-indigo-500 hover:border-indigo-500 transition-all ease-in-out delay-150"
                >
                  <p>View Quiz </p> <IoIosArrowRoundForward size={32} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-screen w-screen flex items-center justify-center">
         {isAdmin ? <button className="text-white bg-indigo-500 px-4 py-2 rounded-md" onClick={()=> navigate(`/createquiz/${language}`)}>Create Quiz</button>: <p>No quizzes yet....</p>}
        </div>
      )}
    </div>
  );
};

export default AllQuizzes;
