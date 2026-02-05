import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Api from '../../api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [validation, setValidation] = useState({})
  const [loginFailed, setLoginFailed] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/admin')
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setValidation({})
    setLoginFailed('')

    try {
      const response = await Api.post('/auth/login', {
        email: email,
        password: password,
      })

      const token = response.data.data.token
      const user = response.data.data.user

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      navigate('/admin')
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setValidation(error.response.data.errors)
        } else if (error.response.status === 401) {
          setLoginFailed(error.response.data.message)
        } else {
          setLoginFailed('Terjadi kesalahan server.')
        }
      } else {
        setLoginFailed('Tidak dapat terhubung ke server.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login Admin</h2>

        {loginFailed && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm text-center">{loginFailed}</div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@email.id"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {validation.email && <p className="text-red-500 text-xs mt-1">{validation.email[0]}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              autoComplete="current-password"
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {validation.password && <p className="text-red-500 text-xs mt-1">{validation.password[0]}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-bold py-2 px-4 rounded transition duration-200 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? 'LOADING...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  )
}
