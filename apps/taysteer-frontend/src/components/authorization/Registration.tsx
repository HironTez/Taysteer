import { FormEventHandler, useMemo, useState } from 'react';
import './Authorization.sass';
import $ from 'jquery';
import { debounce, popup, submitForm } from '../../scripts/own.module';
import { Loading } from '../loading.spinner/Loading.spinner';

export const Registration: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const changeHandler: FormEventHandler<Element> = () => {
    $('input.error').each((_index, element) =>
      (element as HTMLInputElement).setCustomValidity('')
    );
    $('.error').removeClass('error');

    debounceHandler();
  };

  const debounceHandler = useMemo(
    () =>
      debounce(() => {
        handleForm();
      }, 1000),
    []
  );

  const handleForm = () => {
    const loginElement = document.querySelector(
      'input[name="login"]'
    ) as HTMLInputElement;
    const passwordElement = document.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement;
    const confirmPasswordElement = document.querySelector(
      'input[name="confirm-password"]'
    ) as HTMLInputElement;
    // Check if login doesn't contain special characters
    if (!/^[a-zA-Z0-9]+$/.test(loginElement.value)) {
      loginElement.classList.add('error');
      loginElement.setCustomValidity('Special characters are not allowed');
    };
    // Check if passwords match
    if (passwordElement.value !== confirmPasswordElement.value) {
      confirmPasswordElement.classList.add('error');
      confirmPasswordElement.setCustomValidity('Passwords do not match');
    }
  };

  const submitHandler: FormEventHandler<Element> = (event) => {
    handleForm(); // Validate form
    // Submit form
    submitForm(
      event,
      '/api/users',
      '/login',
      { method: 'post', enctype: 'multipart/form-data' },
      undefined,
      // On error
      (error) => {
        if (error.status === 409) {
          popup('This login is already taken', 'error'); // Show error
          $('input[name="login"]').addClass('error'); // Change input color
          // Add custom validity
          $('input[name="login"]').each((_i, element) => {
            (element as HTMLInputElement).setCustomValidity(
              'Login already exists'
            );
          });
        } else if (error.status >= 500) {
          popup('Server error', 'error');
        } else {
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
          <div className="title">Sign up</div>
          <form target="/" onChange={changeHandler} onSubmit={submitHandler}>
            <label>
              Name (optional)
              <input
                type="text"
                name="name"
                placeholder="Type your name"
                maxLength={50}
              />
            </label>
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
            <label>
              Repeat your password
              <input
                type="password"
                name="confirm-password"
                placeholder="Re-type the password"
                required
                maxLength={50}
              />
            </label>
            <input type="submit" value="Sign up" />
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
