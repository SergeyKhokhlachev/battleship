import { createStore } from "vuex";

export default createStore({
  state: {
    game: {},
    user: {},
    opponent: {},
  },
  getters: {
    GET_GAME: (state) => {
      return state.game;
    },
    GET_USER: (state) => {
      return state.user;
    },
    GET_OPPONENT: (state) => {
      return state.opponent;
    },
  },
  mutations: {
    SET_GAME: (state, data) => {
      state.game = data;
    },
    SET_USER: (state, data) => {
      state.user = data;
    },
    SET_OPPONENT: (state, data) => {
      state.opponent = data;
    },
  },
  actions: {
    SET_GAME: (context, data) => {
      context.commit("SET_GAME", data);
    },
    SET_USER: (context, data) => {
      context.commit("SET_USER", data);
    },
    SET_OPPONENT: (context, data) => {
      context.commit("SET_OPPONENT", data);
    },
  },
});
