import axios from "axios";
import React, { useState } from "react";

const CreateQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [options, setOptions] = useState([
    { text: "", isAnswer: false },
    { text: "", isAnswer: false },
    { text: "", isAnswer: false },
    { text: "", isAnswer: false },
  ]);
  const [quizTitle, setQuizTitle] = useState("");

  const handleAddQuestion = () => {
    setIsModalOpen(true);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = value;
    setOptions(updatedOptions);
  };

  const handleAnswerChange = (index) => {
    const updatedOptions = options.map((option, idx) => ({
      ...option,
      isAnswer: idx === index, // Set the correct answer
    }));
    setOptions(updatedOptions);
  };

  const handleSubmitQuestion = () => {
    const questionData = {
      question: newQuestion,
      options: options.map(option => ({ text: option.text, isAnswer: option.isAnswer })), // Structure options
    };
    setQuestions([...questions, questionData]);
    setIsModalOpen(false);
    setNewQuestion("");
    setOptions([
      { text: "", isAnswer: false },
      { text: "", isAnswer: false },
      { text: "", isAnswer: false },
      { text: "", isAnswer: false },
    ]);
  };

  const handleSubmitQuiz = async () => {
    console.log(questions);
    try {
      const response = await axios.post("http://localhost:5000/quiz", {
        title: quizTitle,
        questions,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <input
        type="text"
        name="title"
        id="title"
        placeholder="Quiz Title..."
        onChange={(e) => setQuizTitle(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <div className="flex">
        <button
          onClick={handleAddQuestion}
          className="mb-4 mr-4 p-2 bg-blue-500 text-white rounded"
        >
          Add Question
        </button>
        <button
          onClick={handleSubmitQuiz}
          className="mb-4 p-2 bg-blue-500 text-white rounded"
          disabled={!quizTitle || questions.length === 0}
        >
          Submit Quiz
        </button>
      </div>
      <div className="flex flex-col">
        {questions.map((q, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold">{`Question ${index + 1}: ${q.question}`}</h3>
            {q.options.map((option, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="radio"
                  id={`question-${index}-option-${i}`}
                  name={`question-${index}`}
                  value={option.text}
                  checked={option.isAnswer}
                  readOnly
                  className="mr-2"
                />
                {option.text}
              </div>
            ))}
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl mb-2">Add Question</h2>
            <input
              type="text"
              placeholder="Enter your question"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="mb-2 p-2 border border-gray-300 rounded w-full"
            />
            {options.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="border border-gray-300 rounded w-full p-2 mr-2"
                />
                <input
                  type="radio"
                  checked={option.isAnswer}
                  onChange={() => handleAnswerChange(index)}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-red-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitQuestion}
                className="p-2 bg-green-500 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuiz;
