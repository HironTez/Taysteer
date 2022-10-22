/* eslint-disable @typescript-eslint/no-explicit-any */
import $ from 'jquery';
import { FormEvent } from 'react';

export const horizontalScrollDirection = () => {
  // Change the scroll direction relative to the screen width
  const processScrollDirection = () => {
    if (Number($(window).width()) < 1000) {
      $('.horizontal-scroll.active').removeClass('active');
    } else {
      $('.horizontal-scroll:not(.active)').addClass('active');
    }
  };

  window.onresize = processScrollDirection;
};

// Debounce function
export const debounce = (fn: (...args: any[]) => void, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>; // Initialize timeout variable
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId); // Clear timer
    timeoutId = setTimeout(() => fn.apply(this, args), ms); // Set timer
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
  onError?: (error: JQuery.jqXHR<any>) => void,
  setLoading?: (loading: boolean) => void,
  setError?: (error: string | null) => void
) => {
  event.preventDefault(); // Prevent from submitting form directly
  const form = event.currentTarget as HTMLFormElement;
  const formData = new FormData(form);

  if (setLoading) setLoading(true); // Set loading to true
  if (setError) setError(null); // Empty error

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

      if (setLoading) setLoading(false);
      if (onSuccess) onSuccess(response); // Callback
    })
    .fail((error) => {
      // Show the error
      if (error.status >= 500) {
        popup('Something went wrong. Try again.', 'error');
      }

      if (setLoading) setLoading(false);
      if (setError) setError(error.statusText);
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

// Allow vertical scrolling for react page
export const allowVerticalScroll = (allow = true) => {
  document.body.style.overflowY = allow ? 'auto' : 'hidden';
};

// Scroll to element
export const scrollToElem = (elem: HTMLElement) => {
  const posToScroll = elem.offsetTop; // Get element position to scroll to
  window.scrollTo({ top: posToScroll + 1, left: 0, behavior: 'smooth' }); // Scroll to the position
};

// Allows to return values from callback functions
// Usage:
// const promiseController = new PromiseController();
// someFunc((callbackData) => {return promiseController.resolve(callbackData);})
// const response = await promiseController.promise;
export class PromiseController {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
  promise: Promise<any>;
  resolve: (reason?: any) => void = () => null;
  reject: (value: any) => void = () => null;
}

// Load image by url
export const urlToObject = async (imageUrl: string) => {
  const response = await fetch(imageUrl);
  if (response.ok) {
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: blob.type });
    return file;
  } else return null;
};

// Get list with range of number
export const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, k) => k + start);

// Convert date object to "time ago" string
export const dateToTimeAgo = (date: Date): string => {
  const now = new Date(Date.now());
  const difftime = now.getTime() - new Date(date).getTime();
  const diffDate = new Date(difftime);
  const [sec, min, hr, day, month, year] = [
    diffDate.getSeconds(),
    diffDate.getMinutes(),
    diffDate.getHours() - 3,
    diffDate.getDate() - 1,
    diffDate.getMonth(),
    diffDate.getFullYear() - 1970,
  ];
  const toString = (property: number, end: string) => {
    return `${property} ${end}${property > 1 ? 's' : ''} ago`;
  };

  return year >= 1
    ? toString(year, 'year')
    : month >= 1
    ? toString(month, 'month')
    : day >= 1
    ? toString(day, 'day')
    : hr >= 1
    ? toString(hr, 'hr')
    : min >= 1
    ? toString(min, 'min')
    : sec >= 1
    ? toString(sec, 'sec')
    : '';
};

export const confirmDialogElement = (
  callbackOnConfirm: (() => void) | null,
  callbackOnCancel: (() => void) | null,
  text = 'Confirm action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel'
) => {
  const containerElem = $(`<div class="confirm-dialog"></div>`);
  const backgroundElem = $(`<div class="background"></div>`);
  const textElem = $(`<div class="text">${text}</div>`);
  const confirmButton = $(
    `<button class="confirm orange">${confirmText}</button>`
  );
  const cancelButton = $(`<button class="cancel gray">${cancelText}</button>`);

  const deleteDialog = () => {
    backgroundElem.remove();
    containerElem.remove();
  };
  backgroundElem.on('click', deleteDialog);
  confirmButton.on('click', () => {
    deleteDialog();
    if (callbackOnConfirm) callbackOnConfirm();
  });
  cancelButton.on('click', () => {
    deleteDialog();
    if (callbackOnCancel) callbackOnCancel();
  });

  containerElem.append(textElem);
  containerElem.append(confirmButton);
  containerElem.append(cancelButton);
  $('#root').append(backgroundElem);
  $('#root').append(containerElem);
};

export const exec = (func: () => void) => {
  func();
};
