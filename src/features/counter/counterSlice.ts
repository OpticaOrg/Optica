import { createSlice, type PayloadAction, type ThunkAction } from '@reduxjs/toolkit';
import { type RootState } from '../../store/store';

interface CounterState {
  value: number
}

const initialState = {
  value: 0
}
// RTK allows for "mutating" state logic in reducers by using a library called Immer.
// I think it basically abstracts away the process of having to clone state anytime you want to update it.
// these are ACTIONS?
export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    }
  }
})

/**
 * incrementAsync is a thunk function that dispatches those actions using the Redux Thunk middleware.
 * 
 * @param amount: number
 * @returns: ThunkAction<void, RootState, unknown, any>
 */
export const incrementAsync = (amount: number): ThunkAction<void, RootState, unknown, any> => (dispatch) => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount))
  }, 1000)
}

/**
 * The generated action creators will be named increment, decrement, and incrementByAmount.
 */
export const { increment, decrement, incrementByAmount } = counterSlice.actions

/**
 * selectCount is a selector function that takes a Redux state and returns the current value of counter.value from the state.
 * 
 * @param state 
 * @returns 
 */
export const selectCount = (state: { counter: CounterState }): number => state.counter.value
export default counterSlice.reducer
