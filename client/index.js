import React from 'react';
import { createRoot } from 'react-dom/client';
// import './index.css'
import App from './App';

// wrapping App in a Provider component with store prop makes the store available to the App
const container = document.querySelector('#root');
const root = createRoot(container);
root.render(
    <App />
);
