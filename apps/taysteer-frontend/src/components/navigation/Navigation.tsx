import { NavLink } from 'react-router-dom';
import './Navigation.sass';
import homepageIcon from '../../assets/images/navigation/home-icon.svg';
import leaderboardIcon from '../../assets/images/navigation/leaderboard-icon.svg';
import createIcon from '../../assets/images/navigation/create-icon.svg';

export const Navigation: React.FC = () => {
  return (
    <nav className="navbar">
      <div>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              <div className="nav-text">Homepage</div>
              <img src={homepageIcon} className="nav-icon" alt="homepage" />
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/leaderboard">
              <div className="nav-text">Top chefs</div>
              <img src={leaderboardIcon} className="nav-icon" alt="leaderboard" />
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/new-recipe">
              <div className="nav-text">New recipe</div>
              <img src={createIcon} className="nav-icon" alt="create new recipe" />
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};
