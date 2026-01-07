import { createSlice } from "@reduxjs/toolkit";



export const DABAPremTeamSlice = createSlice({

  name: 'DABATeam',
  initialState: [],
  reducers: {

    setDABAPremTeamData: (state, action) => {
      state.push(action.payload)
    }

  }
})

export const { setDABAPremTeamData } = DABAPremTeamSlice.actions

export default DABAPremTeamSlice.reducer;