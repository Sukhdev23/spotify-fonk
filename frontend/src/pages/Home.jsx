import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="page-wrapper">
      <section className="page-card">
        <p className="eyebrow">Spotify Fonk</p>
        <h1 className="page-title">All your playlists, one tap away.</h1>
        <p className="page-description">
          Manage authentication flows for the Spotify microservices demo. Use the
          quick links below to jump into the experience.
        </p>
        <div className="page-actions">
          <Link to="/login" className="btn primary">
            Log In
          </Link>
          <Link to="/register" className="btn secondary">
            Create Account
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
