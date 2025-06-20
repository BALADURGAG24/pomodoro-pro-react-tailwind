import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// src/index.js or src/main.jsx
import './styles/index.css'; // or './index.css' depending on your structure

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);