import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode> 因為會造成重複，先移除
    <App />
  // </React.StrictMode>
);
