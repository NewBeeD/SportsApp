import { createSlice } from "@reduxjs/toolkit";



export const DivOneTeamSlice = createSlice({

  name: 'DivOneTeam',
  initialState: [],
  reducers: {

    setDivOneTeamData: (state, action) => {
      state.push(action.payload)
    }

  }
})

export const { setDivOneTeamData } = DivOneTeamSlice.actions

export default DivOneTeamSlice.reducer;