import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AccessibilityProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AccessibilityProvider>
    </ThemeProvider>
  </React.StrictMode>
);
