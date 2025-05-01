import { useState, useEffect, useCallback, useRef, JSX } from 'react';
import {
  createAssistant,
  createSmartappDebugger
} from '@salutejs/client';
import './MotivationApp.css';

const backgroundImages: string[] = [
  '/images/1.png',
  '/images/2.jpg',
  '/images/3.jpg',
  '/images/4.jpg',
  '/images/5.jpg',
  '/images/6.jpg',
  '/images/7.png',
  '/images/8.jpg',
  '/images/9.jpg',
  '/images/10.jpg',
  '/images/11.jpg',
  '/images/12.jpg',
  '/images/13.jpg',
  '/images/14.jpg',
];

interface QuoteResponse {
  quoteText: string;
  quoteAuthor: string;
}

const initializeAssistant = (getState: any) => {
  if (import.meta.env.DEV) {
    return createSmartappDebugger({
      token: import.meta.env.VITE_APP_TOKEN,
      initPhrase: 'Запусти Motivation',
      getState
    });
  } 
  return createAssistant({ getState });
};

const MotivationApp = (): JSX.Element => {
  const [quote, setQuote] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [background, setBackground] = useState<string>('');
  const assistentRef = useRef<ReturnType<typeof createAssistant>>(null);

  const fetchQuote = useCallback(async (previousQuote: string = ''): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const apiUrl =
        'https://api.codetabs.com/v1/proxy/?quest=' +
        encodeURIComponent('https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=ru');

      const response = await fetch(apiUrl);
      const text = await response.text();
      const cleanText = text.replace(/\\'/g, "'");
      const data: QuoteResponse = JSON.parse(cleanText);

      if (data.quoteText) {
        const newQuote = data.quoteText.trim();
        const newAuthor = data.quoteAuthor.trim() || 'Неизвестный автор';

        if (newQuote === previousQuote) {
          console.warn('Та же самая цитата, повторный запрос...');
          return await fetchQuote(previousQuote);
        }

        setQuote(newQuote);
        setAuthor(newAuthor);

        const randomBg =
          backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
        setBackground(randomBg);
      } else {
        throw new Error('Пустой ответ от сервера');
      }
    } catch (err) {
      console.error('Ошибка при получении цитаты:', err);
      setError('Не удалось получить цитату. Попробуйте позже.');
      setQuote('');
      setAuthor('');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClick = async () => {
    await fetchQuote(quote);
  };

  useEffect(() => {
    assistentRef.current = initializeAssistant(() => {});
    assistentRef.current.on('data', ({action} : any) => {
      if (action) {

      }
    });

    return () => {
      assistentRef.current?.close()
    };
  }, []);

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: background ? `url(${background})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <div
        className="quote-container"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '15px',
          padding: '20px',
        }}
      >
        {loading ? (
          <p>Загрузка...</p>
        ) : error ? (
          <div>
            <p className="error-message">{error}</p>
          </div>
        ) : quote ? (
          <>
            <blockquote className="quote-text">"{quote}"</blockquote>
            <p className="quote-author">— {author}</p>
          </>
        ) : (
          <p>Нажми кнопку, чтобы получить цитату!</p>
        )}
        <button className="motivation-button" onClick={handleClick}>
          Получить цитату
        </button>
      </div>
    </div>
  );
};

export default MotivationApp;
