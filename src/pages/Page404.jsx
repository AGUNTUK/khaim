import { Link } from 'react-router-dom'
import './Page404.css'

export default function Page404() {
  return (
    <div className="page404">
      <div className="container">
        <div className="page404-content clay-card">
          <div className="page404-emoji">🍽️</div>
          <h1>Oops!</h1>
          <p>This page got lost in the kitchen</p>
          <p className="page404-desc">
            Looks like this dish isn't on our menu anymore. 
            Let's get you back to something delicious!
          </p>
          <Link to="/" className="clay-btn clay-btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
