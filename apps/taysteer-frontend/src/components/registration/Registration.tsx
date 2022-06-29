import { FormEventHandler, useCallback } from 'react';
import './Registration.sass';
import $ from 'jquery';
import { debounce } from '../../scripts/own.module';

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

  return (
    <div className="form-container">
      <div className="title">Sign up</div>
      <iframe name="dummy-frame" className="dummy-frame"></iframe>
      <form
        action="/api/users"
        method="post"
        encType="multipart/form-data"
        target="dummy-frame"
        onChange={changeHandler}
      >
        <label>
          Name
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
