import { useState, useEffect, useCallback, useRef, JSX } from 'react';

import {
  createAssistant,
  createSmartappDebugger
} from '@salutejs/client';
import './MotivationApp.css';

import {
  QuoteResponse
} from './interfaces';

import { 
  AppContainer, 
  QuoteContainer,
  QuoteAuthor,
  QuoteText,
  Button  
} from './styles';

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

  const quoteRef = useRef<string>('');
  const authorRef = useRef<string>('');
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
        quoteRef.current = newQuote;
        authorRef.current = newAuthor;

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
      quoteRef.current = '';
      authorRef.current = '';
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClick = async () => {
    await fetchQuote(quoteRef.current);
  };

  useEffect(() => {
    assistentRef.current = initializeAssistant(() => ({
      screen: { 
        quote: quoteRef.current, 
        author: authorRef.current, 
        error 
      }
    }));

    assistentRef.current.on('data', ({action} : any) => {
      if (action) {
        switch (action.type) {
          case "repeat_quote":
              assistentRef.current?.sendData({
                action: {
                  action_id: "VOICE",
                  parameters: { text: quoteRef.current, au_text: authorRef.current }
                }
              });
            break;
          
          case "next_quote":
            fetchQuote(quoteRef.current);
            break;
          
          default:
            console.warn('Неизвестный тип действия:', action.type);
            break
        }
      }
    });

    assistentRef.current.on('start', () => {
      console.log('ASSISTANT START');
    });

    return () => {
      assistentRef.current?.close()
    };
  }, []);

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
