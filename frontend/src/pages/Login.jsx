import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const googleAuthUrl = 'http://localhost:3000/api/auth/google'

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // The actual submit will be wired to the backend service later.
    try {
      const response = axios.post(
        'http://localhost:3000/api/auth/login',
        {
          email: form.email,
          password: form.password,
        },
        { withCredentials: true } // cookies allow karne ke liye
      )
      console.log('Login success:', response.data)
      navigate('/')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = googleAuthUrl
    navigate('/')
  }

  return (
    <div className="page-wrapper">
      <section className="page-card">
        <p className="eyebrow">Log In</p>
        <h1 className="page-title">Welcome back.</h1>
        <p className="page-description">Enter your credentials to continue.</p>
        <form className="page-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="alex@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn primary">
            Continue
          </button>
        </form>
        <div className="divider">or</div>
        <button type="button" className="btn social google" onClick={handleGoogleLogin}>
          <svg
            className="icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M21.6 12.23c0-.65-.06-1.27-.18-1.87H12v3.54h5.4c-.23 1.2-.92 2.21-1.95 2.89v2.4h3.16c1.85-1.7 2.99-4.2 2.99-6.96Z"
              fill="#4285F4"
            />
            <path
              d="M12 22c2.7 0 4.96-.9 6.61-2.41l-3.16-2.4c-.88.59-2.01.93-3.45.93-2.65 0-4.9-1.79-5.71-4.21H2.97v2.53C4.6 19.98 8.03 22 12 22Z"
              fill="#34A853"
            />
            <path
              d="M6.29 13.91c-.2-.59-.32-1.23-.32-1.91s.12-1.32.32-1.91V7.56H2.97A9.96 9.96 0 0 0 2 12c0 1.64.39 3.18 1.09 4.44l3.2-2.53Z"
              fill="#FBBC05"
            />
            <path
              d="M12 6.09c1.47 0 2.79.51 3.83 1.52l2.88-2.88C16.95 2.82 14.7 2 12 2 8.03 2 4.6 4.02 2.97 7.56l3.32 2.53C7.1 7.87 9.35 6.09 12 6.09Z"
              fill="#EA4335"
            />
            <path d="M2 2h20v20H2V2Z" fill="none" />
          </svg>
          Continue with Google
        </button>
        <p className="muted-text">
          Need an account? <Link to="/register">Sign up</Link>
        </p>
      </section>
    </div>
  )
}

export default Login
