import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultsPage.css';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, quizData, userAnswers } = location.state || { score: 0, quizData: [], userAnswers: {} };

  return (
    <div className="results-page-container">
      <h1 className="results-title">Your Quiz Results</h1>

      <div className="results-summary">
        <p className="results-score">Score: {score} / {quizData.length}</p>
        <button className="retake-quiz-button" onClick={() => navigate('/quiz')}>
          Retake Quiz
        </button>
      </div>

      <div className="results-list">
        {quizData.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer && userAnswer.trim().toLowerCase() === question.correct_answer.trim().toLowerCase();

          return (
            <div
              key={index}
              className={`result-box ${isCorrect ? 'correct' : 'incorrect'}`}
            >
              <h3 className="result-question">{question.question}</h3>
              <p className={`result-answer ${isCorrect ? 'correct-answer' : 'incorrect-answer'}`}>
                Your answer: {userAnswer || 'No answer provided'}
              </p>
              {!isCorrect && (
                <p className="correct-answer">Correct answer: {question.correct_answer}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsPage;
