import { FormEventHandler, useState } from 'react';
import './Authorization.sass';
import { popup, submitForm } from '../../scripts/own.module';
import { Loading } from '../loading.spinner/Loading.spinner';

export const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  
  const submitHandler: FormEventHandler<Element> = (event) => {
    // Submit form
    submitForm(
      event,
      '/api/login',
      '/profile',
      {
        method: 'post',
        enctype: 'application/json',
      },
      // On success
      () => {
        popup('This website is using cookies to keep you signed in', 'info', 10000);
      },
      // On error
      (error) => {
        // If wrong login or password
        if (error.status === 401) {
          // Show error
          popup('Invalid login or password', 'error');
        } else if (error.status >= 500) {
          popup('Server error', 'error');
        }else {
          popup('Something went wrong. Try again later.', 'error');
        }
      },
      setLoading
    );
  };

  return (
    <div>
      <div className="registration-container">
        <div className="form-container">
          <div className="title">Log in</div>
          <form target="/" onSubmit={submitHandler}>
            <label>
              Login
              <input
                type="text"
                name="login"
                placeholder="Type your login"
                required
                maxLength={50}
                autoCapitalize="none"
                autoCorrect="off"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                name="password"
                placeholder="Type your password"
                required
                maxLength={50}
              />
            </label>
            <input type="submit" value="Log in" />
          </form>
        </div>
      </div>
      {loading && (
        <div className="loading">
          <Loading />
        </div>
      )}
    </div>
  );
};
