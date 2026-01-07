import { createSlice } from "@reduxjs/toolkit";



export const fixtureSlice = createSlice({

  name: 'fixtures',
  initialState: [],
  reducers: {

    populate: (state, action) => {
      state.push(action.payload)
    }

  }
})

export const { populate } = fixtureSlice.actions

export default fixtureSlice.reducer;