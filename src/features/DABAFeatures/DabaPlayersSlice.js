import { createSlice } from "@reduxjs/toolkit";



export const DabaPremPlayersSlice = createSlice({

  name: 'DabaPlayers',
  initialState: [],
  reducers: {

    setDabaPlayersData: (state, action) => {
      state.push(action.payload)
    }

  }
})

export const { setDabaPlayersData } = DabaPremPlayersSlice.actions

export default DabaPremPlayersSlice.reducer;