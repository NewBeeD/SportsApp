import { createSlice } from "@reduxjs/toolkit";



export const DABAPointsSlice = createSlice({

  name: 'DABAPoints',
  initialState: [],
  reducers: {

    setDABAPoints: (state, action) => {
      state.push(action.payload)
    }

  }
})

export const { setDABAPoints } = DABAPointsSlice.actions

export default DABAPointsSlice.reducer;