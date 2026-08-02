import { Link } from 'react-router-dom'

function NavCard({ to, icon, title, subtitle }) {
  return (
    <Link to={to} className="nav-card">
      <div className="nav-card-icon-wrap" aria-hidden="true">
        <div className="nav-card-icon">
          {icon}
        </div>
      </div>
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <span className="nav-card-arrow" aria-hidden="true">→</span>
    </Link>
  )
}

export default NavCard
