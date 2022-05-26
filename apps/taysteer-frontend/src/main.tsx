import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MainPage } from './pages/Main/Main';
import { store } from './store';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigation } from './components/navigation/Navigation';

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <section className="header">
          <Navigation />
        </section>
        <section className="page-content">
          <Routes>
            <Route path="/" element={<MainPage />} />
          </Routes>
        </section>
      </Router>
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);
