import http from "../http-common";

class UserDataService {
    getAcessToken(loginCredentials) {
        return http.post(`/user/`, loginCredentials);
    }

    updateHTTPHeader(token) {
        http.defaults.headers.common['Authorization'] = token;
    }

    logout(pToken) {
        return http.post('/user/logout', pToken);
    }
}

export default new UserDataService();