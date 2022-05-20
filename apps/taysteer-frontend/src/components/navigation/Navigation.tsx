import { NavLink } from 'react-router-dom';

export const Navigation: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Homepage
              </NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink className="nav-link" to="/recipes">
                Recipes
              </NavLink>
            </li> */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/rating">
                Top chefs
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/profile">
                Profile
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
