import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Remove StrictMode in production for better performance
const AppComponent = process.env.NODE_ENV === 'development' ? (
  <React.StrictMode>
    <App />
  </React.StrictMode>
) : (
  <App />
);

root.render(AppComponent);
