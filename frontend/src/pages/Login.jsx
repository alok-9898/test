import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useNotification } from '../contexts/NotificationContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { addToast } = useNotification()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    // No validation - accept any input
    setLoading(true)
    try {
      await login(email, password)
      addToast('Login successful', 'success')
      navigate('/dashboard')
    } catch (error) {
      addToast(error.response?.data?.detail || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="max-w-md w-full glass-card p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>

        <h1 className="text-4xl font-bold text-center mb-2 gradient-text">NepLaunch</h1>
        <p className="text-center text-slate-400 mb-10">Startup Marketplace for Nepal</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full premium-button btn-primary mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-500 hover:text-amber-400 font-medium transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}
