import { createSlice } from "@reduxjs/toolkit";

const showLibrarySlice = createSlice({
  name: "show",
  initialState: [],
  reducers: {
    addShow: (state, action) => {
      state.push({ mongoId: action.payload._id, showId: action.payload.showId, name: action.payload.name, image: action.payload.image, watchedEpisodes: [] });
    },
    deleteShow: (state, action) => {
      return state = state.filter((show) => show.showId !== action.payload);
    },
    handleEpisodes: (state, action) => {
      state = state.filter((show) => show.id !== action.payload.id);
      state.push({ id: action.payload.id, name: action.payload.name, image: action.payload.image, watchedEpisodes: action.payload.watchedEpisodes });
      return state;
    },
    addLibrary: (state, action) => {
      return state = action.payload;
    }
  },
});

export const { addShow, deleteShow, handleEpisodes, addLibrary } = showLibrarySlice.actions;

export default showLibrarySlice.reducer;
