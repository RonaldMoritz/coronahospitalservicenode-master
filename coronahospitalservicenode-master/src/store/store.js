import {createStore} from "vuex";


const store = createStore({
    state: {
        name: "Vue",
        token: '',
        tokenValidUntil: ''
    },
    mutations: {
        updateTokenData(state, tokenObj) {
            state.token = tokenObj.token;
            state.tokenValidUntil = tokenObj.validUntil;
        }
    }
});

export default store;