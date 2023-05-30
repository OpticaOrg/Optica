import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import store from './store/store';
import React from 'react';

// wrapping App in a Provider component with store prop makes the store available to the App
const container = document.querySelector('#root') as HTMLElement;
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
