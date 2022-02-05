import axios from 'axios';
import router from '../../router';

export const state = {
  currentUser: null,
  userInitials:null,
  userToken: getSavedState('auth.token'),
  userDepartment: getSavedState('user.department')
}

export const mutations = {
  SET_CURRENT_USER(state, newValue) {
    const initials = `${newValue.firstname} ${newValue.lastname}`.match(/\b(\w)/g).join('').toUpperCase();
    state.userInitials = initials
    state.currentUser = newValue
  },
  SET_USER_TOKEN(state, token) {
    state.userToken = token;
    saveState('auth.token', token)
    setDefaultAuthHeaders(state)
  },
  SET_USER_DEPARTMENT(state, department) {
    state.userDepartment = department;
    saveState('user.department', department)
  }
}

export const getters = {
  // Whether the user is currently logged in.
  loggedIn(state) {
    return !!state.userToken
  },
}

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  init({ state, dispatch }) {
    setDefaultAuthHeaders(state)
    dispatch('validate')
  },

  // Logs in the current user.
  logIn({ commit, dispatch, getters }, { email, password } = {}) {
    if (getters.loggedIn) return dispatch('validate')

    return axios
      .post('/auth/login', { email, password })
      .then((response) => {
        const {user, access_token:accessToken } = response.data
        commit('SET_CURRENT_USER', user)
        commit('SET_USER_TOKEN', accessToken)
        return user
      })
  },

  // set user department
  setDepartment({ commit }, department) {
    commit('SET_USER_DEPARTMENT', department) ;
  },

  // Logs out the current user.
  logOut({ commit }) {
    return axios
      .post('/auth/logout')
      .then((response) => {
        commit('SET_CURRENT_USER', null);
        commit('SET_USER_TOKEN', null)
      })
  },

  // clear user token
  clearToken({ commit }) {
    commit('SET_CURRENT_USER', null);
    commit('SET_USER_TOKEN', null)
  },

  // register the user
  resetPassword({ commit, dispatch, getters }, { email } = {}) {
    if (getters.loggedIn) return dispatch('validate')

    return axios.post('/api/reset', { email }).then((response) => {
      const message = response.data
      return message
    })
  },

  // Validates the current user's token and refreshes it
  // with new data from the API.
  validate({ commit, state }) {
    if (state.currentUser) return Promise.resolve(state.currentUser)

    return axios.get(`${process.env.API_BASE_URL}auth/user`)
      .then((response) => {
        const user = response.data
        commit('SET_CURRENT_USER', user)
        return user
      })
      .catch((error) => {
        console.log(error.response.status)
        if (error.response && error.response.status === 401) {
          console.log('here')
          commit('SET_USER_TOKEN', null)
          router.push('/login')
        }
        return null
      })
  },
}

// ===
// Private helpers
// ===

function getSavedState(key) {
  return JSON.parse(window.localStorage.getItem(key))
}

function saveState(key, state) {
  window.localStorage.setItem(key, JSON.stringify(state))
}

function setDefaultAuthHeaders(state) {
  axios.defaults.headers.common.Authorization = state.userToken
    ? `Bearer ${state.userToken}`
    : ''
}
