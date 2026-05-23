import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,
}

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
    },
    loginError: (state, action) => {
      state.isLoading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
  },
})

export const { loginStart, loginSuccess, loginError, logout, setUser } = authSlice.actions
export default authSlice.reducer
