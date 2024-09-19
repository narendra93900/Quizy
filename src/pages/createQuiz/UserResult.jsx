import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SideBar from "../../components/SideBar";
import axios from "axios";

const UserResult = () => {
  const { quizId, userId } = useParams();
  const [results, setResults] = useState();
  const [quizDetails, setQuizDetails] = useState();

  const [quizPArticipants, setQuizPArticipants] = useState();

  useEffect(() => {
    fetchQuizResults();
    fetchQuizDetails(quizId);
  }, []);

  const fetchQuizResults = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/answers`,  {params: {
        quizId: quizId,
        userId: userId
      }});
      console.log(response)
      if (response.data) {
        setResults(response.data);
      }
    } catch (error) {
        console.log(error)
    }
  };
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
    //   alert("Failed to fetch quiz details");
    }
  };
  return (
    <div className="flex justify-between p-6 gap-8">
      {/* Left Side */}
      <SideBar />
      <div className="flex flex-1 flex-col">
      <h1 className="text-2xl font-bold">Participant Answers</h1>

      <h2 className="text-2xl font-bold mb-4">Quiz Title: {quizDetails?.title}</h2>

        <div className="">
      {quizDetails?.questions?.map((question, index) => (
          <div key={index} className="mb-4">
            <h2 className="font-semibold">Q{index}.{question.question}</h2>
            {question?.options?.map((option) => (
              <div key={option.text}>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option.text}
                    checked={results?.find((res)=>res?.answers[question?.question] === option.text)}
                    onChange={() =>
                      handleOptionChange(question.question, option.text)
                    }
                    disabled
                    className="mr-2"
                  />
                  {option.text}
                </label>
              </div>
            ))}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default UserResult;
