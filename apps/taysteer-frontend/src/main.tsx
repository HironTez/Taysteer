import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MainPage } from './pages/Main/Main';
import { store } from './store';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigation } from './components/navigation/Navigation';
import './scripts/script';
import { Account } from './components/account/Account';
import { RecipePage } from './pages/Recipe/Recipe';
import { RegistrationPage } from './pages/Registration/Registration';

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
            <Route path="/recipes/:id" element={<RecipePage />} />
            {['/register', '/registration'].map((path, index) => (
              <Route path={path} element={<RegistrationPage />} key={index} />
            ))}
          </Routes>
        </main>
      </Router>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);
