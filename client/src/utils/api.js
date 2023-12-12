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

    deleteShow: (showId, userId) => {
        return axios.delete(`/api/show/${showId}/${userId}`);
    },

    addEpisode: (episodeData) => {
        return axios.post("/api/episode/add", episodeData);
    },

    deleteEpisode: (episodeId, userId) => {
        return axios.delete(`/api/episode/${episodeId}/${userId}`);
    },

    getShowLibrary: (userId) => {
        return axios.get("/api/show/" + userId);
    }
}