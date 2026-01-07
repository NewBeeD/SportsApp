import { createSlice } from "@reduxjs/toolkit";



export const VideoSlice = createSlice({

  name: 'videos',
  initialState: [],
  reducers: {

    populate: (state, action) => {
      state.push(action.payload)
    }

  }
})

export const { populate } = VideoSlice.actions
export default VideoSlice.reducer;