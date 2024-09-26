import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizPage.css'; // Import the new CSS for animations

const QuizPage = () => {
  const [quizData, setQuizData] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/get-quiz')
      .then((response) => response.json())
      .then((data) => setQuizData(data))
      .catch((error) => console.error('Error fetching quiz data:', error));
  }, []);

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let calculatedScore = 0;

    quizData.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      if (userAnswer && userAnswer.trim().toLowerCase() === question.correct_answer.trim().toLowerCase()) {
        calculatedScore += 1;
      }
    });

    setTimeout(() => {
      setScore(calculatedScore);
      setLoading(false);
      navigate('/results', { state: { score: calculatedScore, quizData, userAnswers } });
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat custom-background">
      <h1 className="text-4xl font-bold mb-6 text-white">Take the Quiz!</h1>

      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <h2 className="loading-text">Calculating your results... Please wait</h2>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full opacity-90 max-w-2xl">
          {quizData.map((question, index) => (
            <div key={index} className="quiz-question-box mb-6 p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50">
              <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
              <div>
                {question.options.map((option, i) => {
                  const [label, text] = option.split('. ');
                  return (
                    <label key={i} className="block mb-2">
                      <input
                        type="radio"
                        name={`question-${index}`} // Corrected name attribute syntax
                        value={label}
                        onChange={() => handleAnswerChange(index, label)}
                        disabled={submitted}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {!submitted ? (
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-md p-2 hover:bg-blue-500 transition duration-200 w-full"
            >
              Submit Quiz
            </button>
          ) : null}
        </form>
      )}
    </div>
  );
};

export default QuizPage;
