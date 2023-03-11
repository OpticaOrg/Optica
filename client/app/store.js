import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'

// creating Redux store & config Redux DevTools extension so that its inspectable
export const store = configureStore({
  reducer: {
    // defining a field inside the reducer parameter, we're telling the store to use this slice reducer function to handle all updates to that state
    counter: counterReducer,
  },
})