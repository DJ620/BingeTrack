import { createSlice } from '@reduxjs/toolkit';

const episodesWatchedSlice = createSlice({
    name: 'episode',
    initialState: [],
    reducers: {
        addWatchedEpisode: (state, action) => {
            state.push({ id: action.payload.episodeId, showId: action.payload.showInfo.id, showName: action.payload.showInfo.name })
        },
        deleteWatchedEpisode: (state, action) => {
            return state = state.filter((episode) => episode.id !== action.payload);
        }
    }
});

export const { addWatchedEpisode, deleteWatchedEpisode } = episodesWatchedSlice.actions;

export default episodesWatchedSlice.reducer;