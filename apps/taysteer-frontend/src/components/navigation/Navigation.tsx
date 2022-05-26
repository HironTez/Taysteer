import { NavLink } from 'react-router-dom';
import './Navigation.sass';

export const Navigation: React.FC = () => {
  return (
    <nav className="navbar">
      <div>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              Homepage
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/rating">
              Top chefs
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/create">
              New recipe
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};
