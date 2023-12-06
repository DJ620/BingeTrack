import { createSlice } from "@reduxjs/toolkit";

const showLibrarySlice = createSlice({
  name: "show",
  initialState: [],
  reducers: {
    addShow: (state, action) => {
      state.push({ id: action.payload.id, name: action.payload.name, image: action.payload.image, watchedEpisodes: [] });
    },
    deleteShow: (state, action) => {
      return state = state.filter((show) => show.id !== action.payload);
    },
    handleEpisodes: (state, action) => {
      state = state.filter((show) => show.id !== action.payload.id);
      state.push({ id: action.payload.id, name: action.payload.name, image: action.payload.image, watchedEpisodes: action.payload.watchedEpisodes });
      return state;
    }
  },
});

export const { addShow, deleteShow, handleEpisodes } = showLibrarySlice.actions;

export default showLibrarySlice.reducer;
