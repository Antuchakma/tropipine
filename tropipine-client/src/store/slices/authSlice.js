import { createSlice } from '@reduxjs/toolkit'

const getInitialState = () => {
  try {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
      isLoading: false,
      error: null,
    }
  } catch (e) {
    return {
      user: null,
      token: null,
      isLoading: false,
      error: null,
    }
  }
}

const initialState = getInitialState()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isLoading = false
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    loginError: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    setUser: (state, action) => {
      state.user = action.payload
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload))
      }
    },
  },
})

export const { loginStart, loginSuccess, loginError, logout, setUser } = authSlice.actions
export default authSlice.reducer
