import { createSlice } from "@reduxjs/toolkit";



export const articleSlice = createSlice({

  name: 'articles',
  initialState: [],
  reducers: {

    populate: (state, action) => {
      state.push(action.payload)
    }

  }
})

export const { populate } = articleSlice.actions

export default articleSlice.reducer;