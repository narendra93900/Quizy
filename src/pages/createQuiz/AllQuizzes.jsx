import { useEffect, useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SideBar from "../../components/SideBar";

const AllQuizzes = () => {
  
  const navigate = useNavigate();
  const { language } = useParams();
  const [quizes, setQuizes] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [quizPArticipants, setQuizPArticipants] = useState();
  const [userId, setUserId] = useState();

  useEffect(() => {
    fetchQuizs();
    fetchQuizPArticipants();
  }, []);
  const fetchQuizs = async () => {
    setUserId(await localStorage.getItem('userId'))
    try {
      const response = await axios.get(`http://localhost:5000/quiz`, {
        params: {
          language: language,
        },
      });

      const admin = await JSON.parse(localStorage.getItem("isAdmin"));

      // console.log(response)
      setQuizes(response.data);
      await setIsAdmin(admin);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchQuizPArticipants = async () => {
    try {
      const participantResponse = await axios.get(
        `http://localhost:5000/quizParticipants`
      );
      if (participantResponse.data) {
        setQuizPArticipants(participantResponse.data);

        
      }
    } catch (error) {}
  };

  return (
    <div className="flex justify-between p-6 gap-8">
      {/* Left Side */}
      <SideBar />

      {/* Right Side */}

      {quizes && quizes.length ? (
        <div className="flex-col flex-1 p-10">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-4xl font-bold">All Quizzes</h1>

            {isAdmin ? (
              <button
                className="text-white bg-indigo-500 px-4 py-2 rounded-md"
                onClick={() => navigate(`/createquiz/${language}`)}
              >
                Create Quiz
              </button>
            ) : (
              <></>
            )}
          </div>
          <div className="w-full h-full grid gap-8 grid-cols-2 auto-cols-max mt-12 ">
            {quizes.map((quiz) => (
              <div
                key={quiz._id}
                className="h-fit mb-4 min-w-80 border-2 p-8 rounded-md shadow-lg cursor-pointer hover:shadow-2xl transition-all ease-in-out delay-150"
                // onClick={() => navigate(`/quizdetails/${quiz?.id}`)}
              >
                <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>
                <p className="text-gray-400 mb-4">
                  Total Questions: {quiz.questions.length}
                </p>
                <p className="text-gray-400 mb-4">
                  No of users Attempted:{" "}
                  {
                    quizPArticipants?.find((q) => q.id === quiz?.id)
                      ?quizPArticipants?.find((q) => q.id === quiz?.id)?.participants?.length:0
                  }
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => navigate(`/quizdetails/${quiz.id}/${userId}`)}
                    className="mt-8 flex items-center justify-center gap-4 border-2 px-4 py-2 rounded-md text-white bg-indigo-500 shadow-indigo-500/50 hover:bg-white hover:text-indigo-500 hover:border-indigo-500 transition-all ease-in-out delay-150"
                  >
                    <p>View Quiz </p> <IoIosArrowRoundForward size={32} />
                  </button>
                  {isAdmin ? (
                    <button
                      className="mt-8 flex items-center justify-center gap-4 border-2 px-4 py-2 rounded-md text-white bg-indigo-500 shadow-indigo-500/50 hover:bg-white hover:text-indigo-500 hover:border-indigo-500 transition-all ease-in-out delay-150"
                      onClick={() => navigate(`/results/${quiz?.id}`)}
                    >
                      View Result
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-screen w-screen flex items-center justify-center">
          {isAdmin ? (
            <button
              className="text-white bg-indigo-500 px-4 py-2 rounded-md"
              onClick={() => navigate(`/createquiz/${language}`)}
            >
              Create Quiz
            </button>
          ) : (
            <p>No quizzes yet....</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AllQuizzes;
