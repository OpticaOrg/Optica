import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0,
}
// RTK allows for "mutating" state logic in reducers by using a library called Immer. 
// I think it basically abstracts away the process of having to clone state anytime you want to update it.
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

// Generated Action creators for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer