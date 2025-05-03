import { useState, useEffect, useCallback, useRef, JSX } from 'react';
import styled from 'styled-components';
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
  '/images/13.jpg'
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

export const AppContainer = styled.div<{ background: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-image: ${({ background }) => `url(${background})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  transition: background-image 0.5s ease;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4); // тёмная вуаль поверх картинки
    z-index: 0;
  }
`;

export const QuoteContainer = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  width: 90%;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: fadeIn 0.6s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const QuoteText = styled.blockquote`
  font-size: 1.8rem;
  line-height: 1.6;
  color: #1c1c1e;
  margin-bottom: 24px;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

export const QuoteAuthor = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #21a038; // фирменный зелёный Сбера
  margin-bottom: 32px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const Button = styled.button`
  padding: 16px 36px;
  font-size: 1.2rem;
  background-color: #21a038; // зелёный Сбер
  color: white;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 6px 16px rgba(33, 160, 56, 0.4);

  &:hover {
    background-color: #1a8030;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(33, 160, 56, 0.5);
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 0 4px 12px rgba(33, 160, 56, 0.3);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 12px 24px;
  }
`;


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
    assistentRef.current = initializeAssistant(() => ({
      screen: { quote, author, error }
    }));

    assistentRef.current.on('data', ({action} : any) => {
      if (action) {
        switch (action.type) {
          case "repeat_quote":
            if (quote) {
              assistentRef.current?.sendData({
                action: {
                  action_id: "repeat_quote",
                  parameters: { text: quote, au_text: author }
                }
              });
            }
            break;
          
          case "next_quote":
            fetchQuote(quote);
            break;
          
          default:
            throw new Error();
        }
      }
    });

    return () => {
      assistentRef.current?.close()
    };
  }, [quote, author, error, fetchQuote]);

  return (
    <AppContainer background={background}>
      <QuoteContainer>
        {loading ? (
          <p>Загрузка...</p>
        ) : error ? (
          <p>{error}</p>
        ) : quote ? (
          <>
            <QuoteText>"{quote}"</QuoteText>
            <QuoteAuthor>— {author}</QuoteAuthor>
          </>
        ) : (
          <p>Нажми кнопку, чтобы получить цитату!</p>
        )}
        <Button onClick={handleClick}>
          {quote ? 'Другую цитату' : 'Выдать цитату'}
        </Button>
      </QuoteContainer>
    </AppContainer>
  );
};

export default MotivationApp;
