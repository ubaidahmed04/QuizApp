import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Spin } from 'antd';
import LoadingBar from 'react-top-loading-bar';
import './Quiz.css';

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(true);
  const [isLoader, setLoader] = useState(true);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  useEffect(() => {
    fetch("https://the-trivia-api.com/v2/questions/")
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
        setLoader(false);
      })
      .catch((error) => {
        console.error('Error fetching questions:', error);
        setLoader(false);
      });
  }, []);

  useEffect(() => {
    setSelectedAnswer(null);
    // Shuffle answers when moving to a new question
    if (currentQuestionIndex < questions.length) {
      const allAnswers = shuffleArray([
        ...questions[currentQuestionIndex]?.incorrectAnswers || [],
        questions[currentQuestionIndex]?.correctAnswer,
      ]);
      setShuffledAnswers(allAnswers);
    }
  }, [currentQuestionIndex, questions]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNxtQues = () => {
    setProgress((prevProgress) => Math.min(prevProgress + 12, 90));

    if (currentQuestionIndex < 9) {
      setCurrentQuestionIndex((prevQues) => prevQues + 1);
    } else {
      console.log("select wrong question");
    }

    if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
      setScore((prevScore) => prevScore + 10);
    } else {
      console.log("Select Wrong Answer");
    }
  };

  const playAgain = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(true);
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  return (
    <>
      <LoadingBar
        color="#0066ff"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="head">
        {isLoader ? (
          <Spin tip="Loading" size="large">
            <div className="content" />
          </Spin>
        ) : (
          <div className="container">
            
            {showResult ? (
              <div className="main">
                <div className="start">
                  <h1 className="heading text-center">Quiz Game</h1>
                  <div>
                    <h3 className="Question">
                      {questions[currentQuestionIndex]?.question?.text}
                    </h3>
                    <h5 className="category">
                      Category: {questions[currentQuestionIndex]?.category}
                    </h5>
                  </div>
                  <div className="mt-4 input">
                    {shuffledAnswers.map((answer, index) => (
                      <div key={index}>
                        <input
                          type="radio"
                          id={`option${index}`}
                          name="answerOptions"
                          value={answer}
                          checked={selectedAnswer === answer}
                          onChange={() => handleAnswerSelect(answer)}
                        />
                        <label htmlFor={`option${index}`}>{answer}</label>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <Button
                      variant="outline-info"
                      disabled={!selectedAnswer}
                      onClick={handleNxtQues}
                    >
                      {currentQuestionIndex < 9
                        ? 'Next Question'
                        : setShowResult(false)}
                    </Button>
                  </div>
                  <p className="mt-2">{currentQuestionIndex + 1}/9</p>
                </div>
              </div>
            ) : (
              <div className="score-div">
                <div className="showResult">
                  <span className="fw-400 display-5"> Score {score}/90</span>
                  <Button
                    onClick={playAgain}
                    className="display-3 fw-300 mt-4"
                  >
                    Play Again
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Quiz;

