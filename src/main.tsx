import React from 'react';
import { createRoot } from 'react-dom/client';
import MotivationApp from './MotivationApp';
import './index.css';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <MotivationApp />
  </React.StrictMode>
);