import { createSlice } from '@reduxjs/toolkit'

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
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

export const incrementAsync = (amount) => (dispatch) => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount))

  }, 1000)
}

// Generated Action creators for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions
export const selectCount = (state) => state.counter.value
export default counterSlice.reducer