import React from 'react';
import { createRoot } from 'react-dom/client';
// import './index.css'
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';

// wrapping App in a Provider component with store prop makes the store available to the App
const container = document.querySelector('#root');
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
