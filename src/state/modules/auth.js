import axios from 'axios'
import router from '../../router'
import auth from '@/src/msalConfig/auth'

export const state = {
  currentUser: null,
  userInitials: null,
  userToken: getSavedState('auth.token'),
  userDepartment: getSavedState('user.department'),
  user: null,
  msalConfig: {
    auth: {
      clientId: '86fdb55a-cbfe-42f8-810a-191bf9a000b4',
      authority:
        'https://login.microsoftonline.com/e801a3ad-3690-4aa0-a142-1d77cb360b07',
    },
    cache: {
      cacheLocation: 'localStorage',
    },
  },
  accessToken: '',
}

export const mutations = {
  SET_CURRENT_USER(state, newValue) {
    const initials = `${newValue && newValue.firstname} ${newValue &&
      newValue.lastname}`
      .match(/\b(\w)/g)
      .join('')
      .toUpperCase()
    state.userInitials = initials
    state.currentUser = newValue
  },
  SET_USER_TOKEN(state, token) {
    state.userToken = token
    saveState('auth.token', token)
    setDefaultAuthHeaders(state)
  },
  SET_USER_DEPARTMENT(state, department) {
    state.userDepartment = department
    saveState('user.department', department)
  },
  setAccessToken(state, token) {
    state.accessToken = token
  },
  GRAPH_USER(state, user) {
    state.user = user
  },
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

  setCurrentUser({ commit }, payload){
    commit('SET_CURRENT_USER', payload)
  },

  // Logs in the current user.
  logIn({ commit, dispatch, getters }, { email, password } = {}) {
    if (getters.loggedIn) return dispatch('validate')

    return axios.post('/auth/login', { email, password }).then((response) => {
      const { user, access_token: accessToken } = response.data
      commit('SET_CURRENT_USER', user)
      commit('SET_USER_TOKEN', accessToken)
      auth.configure('3082b7e9-5aca-4942-a4a3-1a796b8bf037', false)
      // Restore any cached or saved local user
      commit('GRAPH_USER', auth.user())
      return user
    })
  },

  // set user department
  setDepartment({ commit }, department) {
    commit('SET_USER_DEPARTMENT', department)
  },

  async changePassword(
    { commit, getters },
    { password, newPassword, firstTime } = {}
  ) {
    const response = await axios.post('/auth/change/password', {
      new_password: newPassword,
      first_time: firstTime,
      ...(firstTime ? {} : { password }),
    })
    if (response) {
      commit('SET_CURRENT_USER', {
        ...getters.currentUser,
        must_change_password: 0,
      })
      return true
    }
  },

  // Logs out the current user.
  async logOut({ commit }) {
    await axios.post('/auth/logout')
    commit('SET_CURRENT_USER', null)
    commit('SET_USER_TOKEN', null)
  },

  // clear user token
  clearToken({ commit }) {
    router.push({ name: 'login' })
    commit('SET_CURRENT_USER', null)
    commit('SET_USER_TOKEN', null)
  },

  // request the user
  resetPassword(
    { commit, dispatch, getters },
    { password, confirm_password: confirmPassword, token } = {}
  ) {
    if (getters.loggedIn) return dispatch('validate')

    return axios
      .post('/auth/reset/password', {
        password,
        confirm_password: confirmPassword,
        token,
      })
      .then((response) => {
        const message = response.data
        return message
      })
  },

  requestResetPassword({ commit, dispatch, getters }, { email } = {}) {
    if (getters.loggedIn) return dispatch('validate')

    return axios
      .post('/auth/send/password-reset/request', { email })
      .then((response) => {
        const message = response.data
        return message
      })
  },

  // Validates the current user's token and refreshes it
  // with new data from the API.
  async validate({ commit, state }) {
    if (state.currentUser) return Promise.resolve(state.currentUser)

    try {
      const response = await axios.get(
        `${process.env.API_BASE_URL}auth/user`
      )
      const user = response.data
      commit('SET_CURRENT_USER', user)
      auth.configure('3082b7e9-5aca-4942-a4a3-1a796b8bf037', false)
      // Restore any cached or saved local user
      commit('GRAPH_USER', auth.user())
      return user
    } catch (error) {
      if (error.response && error.response.status === 401) {
        commit('SET_USER_TOKEN', null)
      }
      return null
    }
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
