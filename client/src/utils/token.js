export default {
    getToken: function() {
        let token = JSON.parse(localStorage.getItem("token"));
        if (token) {
            return token;
        } else {
            return null;
        };
    },

    getId: function() {
        const token = this.getToken();
        if (token) {
            return JSON.parse(atob(token.split(".")[1])).userId;
        } else {
            return null;
        };
    },

    getUsername: function() {
        const token = this.getToken();
        if (token) {
            return JSON.parse(atob(token.split(".")[1])).username;
        } else {
            return null;
        };
    },

    getTokenInfo: function() {
        const token = this.getToken();
        if (token) {
            return JSON.parse(atob(token.split(".")[1]));
        } else {
            return null;
        }
    }

};