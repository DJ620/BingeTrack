import axios from 'axios';

export default {
    createUser: async (userData) => {
        return axios.post("/api/user/register", userData);
    },

    login: (userData) => {
        return axios.post("/api/user/login", userData);
    },

    verify: function(token) {
        return axios.get("/api/user/" + token);
    },

    addShow: (showData) => {
        return axios.post("/api/show/add", showData);
    },

    deleteShow: (showId, episodeIds, userId) => {
        return axios.post(`/api/show/delete`, {showId, episodeIds, userId});
    },

    watchEpisode: (episodeData) => {
        return axios.post("/api/episode/watch", episodeData);
    },

    unwatchEpisode: (episodeData) => {
        return axios.post(`/api/episode/unwatch`, episodeData);
    },

    watchSeason: (seasonData) => {
        return axios.post("/api/episode/watchSeason", seasonData);
    },

    unwatchSeason: (seasonData) => {
        return axios.post("/api/episode/unwatchSeason", seasonData);
    },

    getShowLibrary: (userId) => {
        return axios.get("/api/show/" + userId);
    }
}