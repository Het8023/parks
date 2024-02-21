import { loginApi, logout, getInfoApi } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
    info: {},
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  settoken: (state, token) => {
    state.token = token;
    setToken(token);
  },
  // 存储用户信息
  setInfo: (state, info) => {
    state.info = info;
  },
};

const actions = {
  // 登录
  async login({ commit }, userInfo) {
    const res = await loginApi(userInfo);
    commit("settoken", res.data.token);
  },

  // 获取用户信息
  async getInfo({ commit }) {
    const res = await getInfoApi();
    // console.log(res);
    commit("setInfo", res.data[0]);
    return res.data[0];
  },

  // user logout
  logout({ commit, state }) {
    commit("RESET_STATE");
    removeToken();
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
