import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const GoogleIcon = () => (
  <svg
    className="icon"
    viewBox="0 0 24 24"
    role="img"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill="#EA4335"
      d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.2-1.9 2.9l3.1 2.4c1.8-1.7 2.7-4.1 2.7-6.7 0-.6-.1-1.2-.2-1.8H12z"
    />
    <path
      fill="#34A853"
      d="M5.3 14.3l-.8.7-2.5 1.9C3.4 19.3 7.4 22 12 22c2.7 0 5-.9 6.6-2.4l-3.1-2.4c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3z"
    />
    <path
      fill="#4A90E2"
      d="M2 7.1C1.4 8.5 1 10 1 11.5s.4 3 1 4.4l3.4-2.6C5.1 12.5 5 12 5 11.5s.1-1 .3-1.5z"
    />
    <path
      fill="#FBBC05"
      d="M12 4.8c1.5 0 2.9.5 3.9 1.4l2.9-2.9C16.9 1.9 14.7 1 12 1 7.4 1 3.4 3.7 2 7.1l3.3 2.9C6.9 6.6 9.3 4.8 12 4.8z"
    />
  </svg>
)

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    fullName: {
      firstName: '',
      lastName: '',
    },
    password: '',
    accountType: 'user',
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
      return
    }

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const response = await axios.post(
      'http://localhost:3000/api/auth/register',
      {
        email: form.email,
        fullName: {
          firstName: form.fullName.firstName,
          lastName: form.fullName.lastName,
        },
        password: form.password,
        role: form.accountType,
      },
      { withCredentials: true }   // cookies allow karne ke liye
    );

    console.log("Registration success:", response.data);

    navigate('/');
  } catch (error) {
    console.error("Registration error:", error);
  }
};


  return (
    <div className="page-wrapper">
      <section className="page-card">
        <p className="eyebrow">Create Account</p>
        <h1 className="page-title">Start listening in seconds.</h1>
        <p className="page-description">
          A single profile unlocks the entire Spotify microservices demo.
        </p>
        <form className="page-form" onSubmit={handleSubmit}>
          <div className="field-group split">
            <div className="field">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                name="fullName.firstName"
                type="text"
                placeholder="Alex"
                value={form.fullName.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                name="fullName.lastName"
                type="text"
                placeholder="Doe"
                value={form.fullName.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
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
              placeholder="Use 8+ characters"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field">
            <span className="field-label">Account type</span>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="accountType"
                  value="user"
                  checked={form.accountType === 'user'}
                  onChange={handleChange}
                />
                <span className="radio-copy">
                  Listener
                  <small>Discover and follow artists.</small>
                </span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="accountType"
                  value="artist"
                  checked={form.accountType === 'artist'}
                  onChange={handleChange}
                />
                <span className="radio-copy">
                  Artist
                  <small>Share releases with fans.</small>
                </span>
              </label>
            </div>
          </div>
          <button type="submit" className="btn primary">
            Create account
          </button>
        </form>
        <div className="divider">
          <span>or</span>
        </div>
        <button
        onClick={()=>{
          window.location.href = 'http://localhost:3000/api/auth/google'
        }}
        type="button" className="btn social google" >
          <GoogleIcon />
          Continue with Google
        </button>
        <p className="muted-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </div>
  )
}

export default Register
