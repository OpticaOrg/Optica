import { PayloadAction, ThunkAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';

interface CounterState {
  value: number;
}

const initialState = {
  value: 0,
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
    },
  },
})

export const incrementAsync = (amount : number) : ThunkAction<void, RootState, unknown, any> => (dispatch) => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount))

  }, 1000)
}

// Generated Action creators for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions
export const selectCount = (state : { counter : CounterState }) => state.counter.value
export default counterSlice.reducer
