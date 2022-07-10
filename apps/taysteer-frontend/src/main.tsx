import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MainPage } from './pages/Main/Main';
import { store } from './store';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigation } from './components/navigation/Navigation';
import './scripts/script';
import { Account } from './components/account/Account';
import { Registration } from './components/authorization/Registration';
import { Login } from './components/authorization/Login';
import { Recipe } from './components/recipe/Recipe';
import { Profile } from './components/profile/Profile';

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <header>
          <Navigation />
          <Account />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/recipes/:id" element={<Recipe />} />
            {['/register', '/registration'].map((path, index) => (
              <Route path={path} element={<Registration />} key={index} />
            ))}
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </Router>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);
