import { createSlice } from "@reduxjs/toolkit";



export const WomenTableSlice = createSlice({

  name: 'WomenTable',
  initialState: [],
  reducers: {

    setWomenTableData: (state, action) => {
      state.push(action.payload)
    }

  }
})

export const { setWomenTableData } = WomenTableSlice.actions

export default WomenTableSlice.reducer;