import { FormEventHandler, useCallback } from 'react';
import './Registration.sass';
import $ from 'jquery';
import { debounce, submitForm } from '../../scripts/own.module';

export const Registration: React.FC = () => {
  const changeHandler: FormEventHandler<Element> = (event) => {
    const target = event.target as HTMLElement;
    $('input.error').each((_index, element) =>
      (element as HTMLInputElement).setCustomValidity('')
    );
    $('.error').removeClass('error');

    debounceHandler(target);
  };

  const debounceHandler = useCallback(
    debounce((arg: HTMLElement) => {
      handleForm(arg);
    }, 1000),
    []
  );

  const handleForm = (target: HTMLElement) => {
    const passwordEl = document.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement;
    const confirmPasswordEl = document.querySelector(
      'input[name="confirm-password"]'
    ) as HTMLInputElement;
    if (
      (target == confirmPasswordEl || target == passwordEl) &&
      passwordEl!.value !== confirmPasswordEl!.value
    ) {
      confirmPasswordEl!.classList.add('error');
      confirmPasswordEl!.setCustomValidity('Passwords do not match');
    }
  };

  const submitHandler: FormEventHandler<Element> = (event) => {
    handleForm(event.currentTarget as HTMLElement); // Validate form
    // Submit form
    submitForm(event, '/api/users', '/', undefined, (error) => {
      if (error.status === 409) {
        $('input[name="login"]').addClass('error'); // Change input color
        $('input[name="login"]').each((_i, element) => {
          (element as HTMLInputElement).setCustomValidity(
            'Login already exists'
          );
        });
      }
    });
  };

  return (
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
  );
};
