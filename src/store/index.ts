import { createStore } from "vuex";

export const store = createStore({
  state() {
    return {
      account: window.localStorage.getItem("account") || null,
      role: window.localStorage.getItem("role") || null,
    };
  },
  mutations: {
    setAccountInfo(state, data) {
      state.account = data.account;
      state.role = data.role;
    },
  },
});
