import { FormEventHandler } from 'react';
import './Authorization.sass';
import { popup, submitForm } from '../../scripts/own.module';

export const Login: React.FC = () => {
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
      undefined,
      // On error
      (error) => {
        // If wrong login or password
        if (error.status === 401) {
          // Show error
          popup('Invalid login or password', 'error');
        }
      }
    );
  };

  return (
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
  );
};
