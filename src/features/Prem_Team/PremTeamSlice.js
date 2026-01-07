import { createSlice } from "@reduxjs/toolkit";



export const PremTeamSlice = createSlice({

  name: 'PremTeam',
  initialState: [],
  reducers: {

    setPremTeamData: (state, action) => {
      state.push(action.payload)
    }

  }
})

export const { setPremTeamData } = PremTeamSlice.actions

export default PremTeamSlice.reducer;