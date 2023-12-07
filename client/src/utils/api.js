import axios from 'axios';

export default {
    createUser: async (userData) => {
        return axios.post("/api/user/register", userData);
    },

    login: (userData) => {
        return axios.post("/api/user/login", userData);
    }
}