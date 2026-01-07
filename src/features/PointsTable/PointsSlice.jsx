import { createSlice } from "@reduxjs/toolkit";



export const pointsSlice = createSlice({

  name: 'points',
  initialState: [],
  reducers: {

    populate: (state, action) => {
      state.push(action.payload)
    }

  }
})

export const { populate } = pointsSlice.actions

export default pointsSlice.reducer;



