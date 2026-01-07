import { createSlice } from "@reduxjs/toolkit";



export const DivOneTableSlice = createSlice({

  name: 'DivOneTable',
  initialState: [],
  reducers: {

    setDivOneTableData: (state, action) => {
      state.push(action.payload)
    }

  }
})

export const { setDivOneTableData } = DivOneTableSlice.actions

export default DivOneTableSlice.reducer;