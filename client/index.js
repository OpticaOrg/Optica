import React from 'react'
import ReactDOM from 'react-dom'
// import './index.css'
import App from './App'
import { store } from './app/store'
import { Provider } from 'react-redux'

// wrapping App in a Provider component with store prop makes the store available to the App
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)