import React, { useState, useEffect } from 'react';
import { questions } from '../questions';

const Quiz = () => {
  // state variables for the quiz
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [finished, setFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showAnswerDelay, setShowAnswerDelay] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null); 

  // Effect hook to manage timer and other state updates
  useEffect(() => {
    let timer;
    if (currentQuestion < questions.length && !finished) {
      if (!showOptions) {
        timer = setTimeout(() => setShowOptions(true), 4000);
      }

      const countdown = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleNextQuestion(null);
            return 30;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdown);
      };
    }
  }, [currentQuestion, showOptions, finished]);

  // Function for selecting an answer and moving to the next question
  const handleNextQuestion = (selectedAnswer) => {
    setSelectedAnswer(selectedAnswer);
    setShowAnswerDelay(true);

    //Save answers and move on to next question after 2 seconds
    setTimeout(() => {
      const newAnswers = [
        ...answers,
        {
          question: questions[currentQuestion].question,
          selected: selectedAnswer,
          correct: questions[currentQuestion].answer,
          isCorrect: selectedAnswer === questions[currentQuestion].answer,
          isBlank: selectedAnswer === null
        }
      ];
      setAnswers(newAnswers);

      if (currentQuestion + 1 >= questions.length) {
        setFinished(true);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setShowOptions(false);
        setTimeLeft(30);
        setSelectedAnswer(null);
      }
      setShowAnswerDelay(false);
    }, 1000);
  };

  // Function to calculate the number of correct, incorrect and blank answers
  const calculateResults = () => {
    const correctCount = answers.filter(answer => answer.isCorrect).length;
    const incorrectCount = answers.filter(answer => !answer.isCorrect && !answer.isBlank).length;
    const blankCount = answers.filter(answer => answer.isBlank).length;
    return { correctCount, incorrectCount, blankCount };
  };

 // Quiz launch function
  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowOptions(false);
    setTimeLeft(30);
    setFinished(false);
  };

  // Quiz result screen
  if (finished) {
    const { correctCount, incorrectCount, blankCount } = calculateResults();
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2 className="result-message">Sonuçlarınız</h2>
          <p>Doğru: {correctCount}</p>
          <p>Yanlış: {incorrectCount}</p>
          <p>Boş: {blankCount}</p>
          {answers.map((answer, index) => (
            <div key={index} className="answer-result">
              <p>Soru {index + 1}: {answer.question}</p>
              <p>Senin cevabın: {answer.selected || 'Boş'}{!answer.isCorrect && answer.selected && ` (Doğru cevap: ${answer.correct})`}</p>
              {answer.isCorrect ? (
                <p className="correct-answer">Doğru</p>
              ) : answer.isBlank ? (
                <p className="blank-answer">Boş</p>
              ) : (
                <p className="incorrect-answer">Yanlış</p>
              )}
            </div>
          ))}
          <button onClick={startQuiz}>Tekrar Başla</button>
        </div>
      </div>
    );
  }

  // Start screen
  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <h2>Quiz App'e Hoş Geldiniz!</h2>
          <p>Bu uygulama ile eğlenceli ve bilgilendirici bir bilgi yarışmasına katılabilirsiniz. Her biri ilginç ve farklı konularda 10 sorudan oluşan testimizi tamamlamaya hazır mısınız?</p>
          <h3>Kurallar:</h3>
          <ul>
            <li>Test, toplamda 10 sorudan oluşmaktadır.</li>
            <li>Her soruyu cevaplamak için 30 saniyeniz var.</li>
            <li>İlk 4 saniyede cevap şıkları görünmeyecektir.</li>
            <li>Bir soruya cevap verdikten sonra ya da 30 saniye dolduğunda otomatik olarak bir sonraki soruya geçilecektir.</li>
            <li>Geçmiş sorulara geri dönemezsiniz, bu yüzden cevabınızı seçmeden önce iyi düşünün!</li>
          </ul>
          <p>Test sonunda, doğru ve yanlış cevap sayılarınızı göreceksiniz. Hazırsanız, başlayın ve bilginizi sınayın!</p>
          <button onClick={startQuiz} className="start-button" id='start'>Teste Başla</button>
        </div>
      </div>
    );
  }

  // Question screen
  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <h2>Soru {currentQuestion + 1}/{questions.length}</h2>
        <p>Kalan zaman: {timeLeft} saniye</p>
        <img src={questions[currentQuestion].media} alt={`Question ${currentQuestion + 1}`} className="question-image" />
        <h3>{questions[currentQuestion].question}</h3>
        {showOptions ? (
          questions[currentQuestion].options.map((option, index) => (
            <button 
              key={index} 
              className={`answer-button ${selectedAnswer === option ? 'selected' : ''}`} // Seçilen cevaba özel stil ver
              onClick={() => !showAnswerDelay && handleNextQuestion(option)} // Do not allow new responses when response delay is active
              disabled={showAnswerDelay} // Disable buttons during delay
            >
              {option}
            </button>
          ))
        ) : (
          <p>Seçenekler 4 saniye içinde görünecektir...</p>
        )}
      </div>
    </div>
  );
};

export default Quiz;
