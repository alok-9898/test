import { createContext, useContext, useState, useEffect } from 'react'
import { MOCK_USERS } from '../mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [token, setToken] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load from localStorage on mount
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      const user = JSON.parse(storedUser)
      setToken(storedToken)
      setCurrentUser(user)
      setRole(user.role)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Mock login - accept any email/password, no validation
    const mockUser = MOCK_USERS[email.toLowerCase()] || {
      id: `user-${Date.now()}`,
      email: email,
      role: email.includes('founder') ? 'FOUNDER' : email.includes('investor') ? 'INVESTOR' : 'TALENT'
    }
    
    const token = `mock-token-${mockUser.id}`
    const user = { id: mockUser.id, role: mockUser.role, email: mockUser.email }
    
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setToken(token)
    setCurrentUser(user)
    setRole(mockUser.role)
    
    return { access_token: token, user_id: mockUser.id, role: mockUser.role }
  }

  const register = async (email, password, role) => {
    // Mock register - no validation
    const userId = `user-${Date.now()}`
    const token = `mock-token-${userId}`
    const user = { id: userId, role: role, email: email }
    
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setToken(token)
    setCurrentUser(user)
    setRole(role)
    
    return { access_token: token, user_id: userId, role: role }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setCurrentUser(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, token, role, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
