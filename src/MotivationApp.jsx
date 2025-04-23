import { useState } from 'react';
import './MotivationApp.css';

const MotivationApp = () => {
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);

  const philosophers = [
    {
      name: "Сократ",
      image: "https://example.com/socrates.jpg", // Замените на реальные URL
      quote: "Я знаю, что ничего не знаю."
    },
    {
      name: "Аристотель",
      image: "https://example.com/aristotle.jpg",
      quote: "Мы есть то, что мы постоянно делаем."
    },
    {
      name: "Фридрих Ницше",
      image: "https://example.com/nietzsche.jpg",
      quote: "То, что не убивает нас, делает нас сильнее."
    },
    {
      name: "Конфуций",
      image: "https://example.com/confucius.jpg",
      quote: "Выбери работу по душе, и тебе не придется работать ни дня в жизни."
    },
    {
      name: "Рене Декарт",
      image: "https://example.com/descartes.jpg",
      quote: "Я мыслю, следовательно, я существую."
    }
  ];

  const getRandomQuote = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * philosophers.length);
    } while (newIndex === currentQuote && philosophers.length > 1);
    return newIndex;
  };

  const handleShowQuote = () => {
    setCurrentQuote(getRandomQuote());
    setShowQuote(true);
  };

  const handleNewQuote = () => {
    setCurrentQuote(getRandomQuote());
  };

  return (
    <div 
      className="app-container" 
      style={{ 
        backgroundImage: showQuote ? `url(${philosophers[currentQuote].image})` : 'none' 
      }}
    >
      {!showQuote ? (
        <button className="motivation-button" onClick={handleShowQuote}>
          Добавить мотивации
        </button>
      ) : (
        <div className="quote-container">
          <blockquote className="quote-text">
            "{philosophers[currentQuote].quote}"
          </blockquote>
          <p className="quote-author">— {philosophers[currentQuote].name}</p>
          <button className="new-quote-button" onClick={handleNewQuote}>
            Добавить еще мотивации
          </button>
        </div>
      )}
    </div>
  );
};

export default MotivationApp;