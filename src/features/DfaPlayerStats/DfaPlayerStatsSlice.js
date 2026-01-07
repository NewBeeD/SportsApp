import { createSlice } from "@reduxjs/toolkit";



export const DfaPremPlayerStatsSlice = createSlice({

  name: 'DivOneTable',
  initialState: [],
  reducers: {

    setDfaPlayersStatsData: (state, action) => {
      state.push(action.payload)
    }

  }
})

export const { setDfaPlayersStatsData } = DfaPremPlayerStatsSlice.actions

export default DfaPremPlayerStatsSlice.reducer;