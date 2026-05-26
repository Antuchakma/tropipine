import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import api from '../services/api'

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch()
  const { token, user } = useSelector((state) => state.auth)

  useEffect(() => {
    // Verify token is still valid on app load
    if (token && !user) {
      // Token exists but user data is missing, try to fetch current user
      const verifyToken = async () => {
        try {
          const response = await api.get('/auth/me')
          // If successful, user is already in state from localStorage
        } catch (error) {
          // Token is invalid or expired, log out
          console.error('Token verification failed:', error)
          dispatch(logout())
        }
      }
      verifyToken()
    }
  }, [token, user, dispatch])

  return children
}
