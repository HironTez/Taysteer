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
  event: FormEvent,
  url: string,
  redirectURL = '/',
  settings: {
    method?: 'get' | 'post';
    enctype?: 'multipart/form-data' | 'application/json';
  } = { method: 'get', enctype: 'application/json' },
  onSuccess?: (response: any) => void,
  onError?: (error: JQuery.jqXHR<any>) => void
) => {
  event.preventDefault(); // Prevent from submitting form directly
  const form = event.currentTarget as HTMLFormElement;
  const formData = new FormData(form);

  $.ajax({
    ...{
      url: url,
      method: settings.method || 'get',
      processData: false,
      contentType: false,
    },
    ...(settings.enctype === 'multipart/form-data'
      ? ({ data: formData, enctype: settings.enctype } as JQuery.AjaxSettings)
      : {
          data: JSON.stringify(serializeForm(form)),
          headers: {
            'Content-Type': 'application/json',
          },
        }),
  })
    .done((response) => {
      redirect(redirectURL);
      form.reset(); // Reset the form

      if (onSuccess) onSuccess(response); // Callback
    })
    .fail((error) => {
      // Show the error
      if (error.status >= 500) {
        popup('Something went wrong. Try again.', 'error');
      }

      if (onError) onError(error); // Error callback
    });
};

const redirect = (url: string) => {
  window.location.href = `/#${url}`;
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

const serializeForm = (form: HTMLFormElement): object => {
  return $(form)
    .serializeArray()
    .reduce(function (data: any, array) {
      data[array.name] = array.value;
      return data;
    }, {});
};
