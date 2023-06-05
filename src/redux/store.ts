import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';

export type RootState = ReturnType<typeof store.getState>

/**
 * The configureStore function accepts a single configuration object parameter, which lets you specify behavior of the store.
 */
const store = configureStore({
  reducer: {
    // defining a field inside the reducer parameter, we're telling the store to use this slice reducer function to handle all updates to that state
    counter: counterReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export default store
