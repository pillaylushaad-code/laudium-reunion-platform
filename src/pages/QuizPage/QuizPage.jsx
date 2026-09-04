import "./QuizPage.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import quizQuestions from "../../data/quizQuestions";
import StudentContext from "../../context/StudentContext";

function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[i],
    ];
  }

  return shuffled;
}

function QuizPage() {
  const navigate = useNavigate();
  const { loggedInStudent, updateStudent } = useContext(StudentContext);

  const [shuffledQuestions] = useState(() =>
    quizQuestions.map((question) => ({
      ...question,
      options: shuffleArray(question.options),
    })),
  );

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [categoryScores, setCategoryScores] = useState({});
  const [timeLeft, setTimeLeft] = useState(20);

  const question = shuffledQuestions[currentQuestion];

  const categoryTotals = shuffledQuestions.reduce((totals, question) => {
    totals[question.category] = (totals[question.category] || 0) + 1;
    return totals;
  }, {});

  const quizResult = {
    score,
    totalQuestions: shuffledQuestions.length,
    percentage: Math.round((score / shuffledQuestions.length) * 100),
    categoryScores,
    categoryTotals,
  };

  const resultToDisplay = loggedInStudent?.quizResult || quizResult;

  const progressPercentage =
    ((currentQuestion + 1) / shuffledQuestions.length) * 100;

  function handleAnswerSelection(answer) {
    setSelectedAnswer(answer);

    const isCorrect = answer === question.correctAnswer;

    if (isCorrect) {
      setFeedback("Correct!");

      setScore((currentScore) => currentScore + 1);

      setCategoryScores((currentScores) => ({
        ...currentScores,
        [question.category]: (currentScores[question.category] || 0) + 1,
      }));
    } else {
      setFeedback("Incorrect!");
    }

    setTimeout(() => {
      if (currentQuestion < shuffledQuestions.length - 1) {
        setSelectedAnswer(null);
        setFeedback("");
        setTimeLeft(20);
        setCurrentQuestion((currentQuestion) => currentQuestion + 1);
      } else {
        setQuizCompleted(true);
      }
    }, 1200);
  }

  useEffect(() => {
    if (
      quizCompleted ||
      loggedInStudent?.quizResult ||
      selectedAnswer !== null
    ) {
      return;
    }

    if (timeLeft <= 0) {
      if (currentQuestion < shuffledQuestions.length - 1) {
        setSelectedAnswer(null);
        setFeedback("");
        setTimeLeft(20);
        setCurrentQuestion((currentQuestion) => currentQuestion + 1);
      } else {
        setQuizCompleted(true);
      }

      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((currentTime) => currentTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [
    timeLeft,
    quizCompleted,
    currentQuestion,
    selectedAnswer,
    loggedInStudent?.quizResult,
    shuffledQuestions.length,
  ]);

  useEffect(() => {
    if (!quizCompleted) return;

    updateStudent({
      quizResult,
    });
  }, [quizCompleted]);

  return (
    <main className="quiz-page">
      {/* ========================================
          QUIZ HEADER
          ======================================== */}

      <header className="quiz-header">
        <button
          className="quiz-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <span aria-hidden="true">←</span>
          Back to Dashboard
        </button>

        <div className="quiz-brand">
          <span className="quiz-brand-mark" aria-hidden="true">
            🔥
          </span>

          <span className="quiz-eyebrow">
            Class of 2013 Reunion Quiz
          </span>

          <h1>How Well Do You Remember?</h1>

          <p>
            Test your memory of the past and celebrate our journey.
          </p>
        </div>

        <div className="quiz-question-count">
          <strong>{shuffledQuestions.length}</strong>
          <span>Questions</span>
        </div>
      </header>

      {!quizCompleted && !loggedInStudent?.quizResult ? (
        <div className="quiz-layout">
          {/* ========================================
              MAIN QUIZ
              ======================================== */}

          <section className="quiz-card">
            <div className="quiz-card-top">
              <div className="quiz-timer">
                <span className="timer-label">Time Remaining</span>

                <strong className={timeLeft <= 5 ? "timer-warning" : ""}>
                  00:{String(timeLeft).padStart(2, "0")}
                </strong>
              </div>

              <div className="quiz-progress">
                <div className="quiz-progress-label">
                  <span>
                    Question {currentQuestion + 1} of{" "}
                    {shuffledQuestions.length}
                  </span>

                  <strong>{Math.round(progressPercentage)}%</strong>
                </div>

                <div className="quiz-progress-track">
                  <div
                    className="quiz-progress-bar"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="question-area">
              <span className="question-category">
                {question.category}
              </span>

              <h2>{question.question}</h2>

              <div className="question-divider" aria-hidden="true">
                <span />
                <b>◆</b>
                <span />
              </div>

              <div className="answer-list">
                {question.options.map((option, index) => {
                  const letter = String.fromCharCode(65 + index);

                  const isSelected = selectedAnswer === option;

                  const isCorrect =
                    isSelected && option === question.correctAnswer;

                  const isIncorrect =
                    isSelected && option !== question.correctAnswer;

                  return (
                    <button
                      className={`answer-option ${
                        isSelected ? "selected" : ""
                      } ${isCorrect ? "correct" : ""} ${
                        isIncorrect ? "incorrect" : ""
                      }`}
                      key={option}
                      onClick={() => handleAnswerSelection(option)}
                      disabled={selectedAnswer !== null}
                    >
                      <span className="answer-letter">
                        {letter}
                      </span>

                      <span className="answer-text">
                        {option}
                      </span>

                      {isCorrect && (
                        <span
                          className="answer-status"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                      )}

                      {isIncorrect && (
                        <span
                          className="answer-status"
                          aria-hidden="true"
                        >
                          ×
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer && (
                <p className="selected-answer">
                  You selected: <strong>{selectedAnswer}</strong>
                </p>
              )}

              {feedback && (
                <div
                  className={`quiz-feedback ${
                    feedback === "Correct!"
                      ? "feedback-correct"
                      : "feedback-incorrect"
                  }`}
                >
                  <strong>{feedback}</strong>

                  <span>
                    {feedback === "Correct!"
                      ? "That's right. Your memory is still sharp."
                      : "Not quite. Keep going — there are more memories to uncover."}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* ========================================
              QUIZ SIDEBAR
              ======================================== */}

          <aside className="quiz-sidebar">
            <section className="score-card">
              <span className="sidebar-label">Your Score</span>

              <div className="score-display">
                <strong>{score}</strong>
                <span>of {shuffledQuestions.length}</span>
              </div>

              <p>
                Keep going. You've got this.
              </p>
            </section>

            <section className="category-card">
              <span className="sidebar-label">
                Category Breakdown
              </span>

              <ul>
                {Object.keys(categoryTotals).map((category) => (
                  <li key={category}>
                    <span>{category}</span>

                    <strong>
                      {categoryScores[category] || 0} /{" "}
                      {categoryTotals[category]}
                    </strong>
                  </li>
                ))}
              </ul>
            </section>

            <section className="quiz-tip">
              <span className="tip-mark" aria-hidden="true">
                ✦
              </span>

              <div>
                <span className="sidebar-label">Quiz Tip</span>

                <p>
                  Trust your memory. Sometimes the first answer that
                  comes to mind is the one you remember for a reason.
                </p>
              </div>
            </section>
          </aside>
        </div>
      ) : (
        /* ========================================
           COMPLETION
           ======================================== */

        <section className="quiz-complete">
          <div className="completion-mark" aria-hidden="true">
            🔥
          </div>

          <span className="quiz-eyebrow">
            Journey Complete
          </span>

          <h2>Quiz Complete!</h2>

          <p className="completion-intro">
            You've completed the reunion quiz.
          </p>

          <div className="final-score">
            <strong>{resultToDisplay.score}</strong>

            <span>
              / {resultToDisplay.totalQuestions}
            </span>
          </div>

          <p className="final-percentage">
            {resultToDisplay.percentage}% remembered
          </p>

          <div className="category-results">
            <h3>Category Scores</h3>

            <ul>
              {Object.keys(categoryTotals).map((category) => (
                <li key={category}>
                  <span>{category}</span>

                  <strong>
                    {resultToDisplay.categoryScores[category] || 0} /{" "}
                    {categoryTotals[category]}
                  </strong>
                </li>
              ))}
            </ul>
          </div>

          <button
            className="completion-btn"
            onClick={() => navigate("/dashboard")}
          >
            Return to Dashboard
            <span aria-hidden="true">→</span>
          </button>
        </section>
      )}
    </main>
  );
}

export default QuizPage;