import $ from 'jquery';
import { FormEvent } from 'react';

export const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export const submitForm = (
  e: FormEvent,
  url: string,
  redirectURL = '/',
  onsuccess?: (response: any) => void,
  onerror?: (error: JQuery.jqXHR<any>) => void
) => {
  e.preventDefault(); // Prevent from submitting form directly
  const form = e.currentTarget as HTMLFormElement;
  const formData = new FormData(form);

  $.ajax({
    url: url,
    method: 'post',
    data: formData,
    enctype: 'multipart/form-data',
    processData: false,
    contentType: false,
  })
    .done((response) => {
      redirect(redirectURL);
      form.reset(); // Reset the form

      if (onsuccess) onsuccess(response); // Callback
    })
    .fail((error) => {
      // Show the error
      if (error.status === 409) {
        popup('User with this login already exists', 'error');
      } else {
        popup('Something went wrong. Try again.', 'error');
      }

      if (onerror) onerror(error); // Error callback
    });
};

export const redirect = (url: string) => {
  window.location.href = url;
};

export const popup = (
  text: string,
  style: 'info' | 'success' | 'error' = 'info',
  duration = 5000
) => {
  const popup = $(`<div class="popup ${style}">${text}</div>`); // Create a new element
  $(document.body).append(popup); // Add it to the HTML
  const animationDuration = Math.min(duration / 3, 1000);
  const shownDuration = duration - animationDuration * 2;
  popup.animate({ opacity: 1 }, animationDuration); // Shown animation
  setTimeout(() => {
    // After 3 sec
    popup.animate(
      {
        // Hiding animation
        opacity: 0,
      },
      {
        duration: animationDuration,
        complete: () => {
          // On animation complete
          popup.remove(); // Remove the element from HTML
        },
      }
    );
  }, shownDuration);
};
