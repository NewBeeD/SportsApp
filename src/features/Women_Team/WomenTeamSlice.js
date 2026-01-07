import { createSlice } from "@reduxjs/toolkit";



export const WomenTeamSlice = createSlice({

  name: 'WomenTeam',
  initialState: [],
  reducers: {

    setWomenTeamData: (state, action) => {
      state.push(action.payload)
    }

  }
})

export const { setWomenTeamData } = WomenTeamSlice.actions

export default WomenTeamSlice.reducer;