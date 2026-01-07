import { createSlice } from "@reduxjs/toolkit";



export const DfaPremPlayersSlice = createSlice({

  name: 'DivOneTable',
  initialState: [],
  reducers: {

    setDfaPlayersData: (state, action) => {
      state.push(action.payload)
    }

  }
})

export const { setDfaPlayersData } = DfaPremPlayersSlice.actions

export default DfaPremPlayersSlice.reducer;