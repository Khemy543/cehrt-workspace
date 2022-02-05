export const state = {
  cached: [],
  toast : null
}

export const getters = {}

export const mutations = {
  CACHE_USER(state, newUser) {
    state.cached.push(newUser)
  },
  SET_TOAST(state, toast) {
    state.toast = toast;
  }
}

export const actions = {
  setToast({ commit }, toast){
    commit('SET_TOAST', toast)
  }
}
