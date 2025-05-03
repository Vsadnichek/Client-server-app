import styled from 'styled-components';

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