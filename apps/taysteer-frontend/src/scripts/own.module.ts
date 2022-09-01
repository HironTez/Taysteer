/* eslint-disable @typescript-eslint/no-explicit-any */
import $ from 'jquery';
import { FormEvent } from 'react';

export const horizontalScroll = () => {
  const scrollableDivs = $('.horizontal-scroll');

  const easeFunction = (remainingScrollDistance: number) => {
    return remainingScrollDistance / 15 + 1;
  };

  uss.hrefSetup();

  scrollableDivs?.on('mousewheel', (event) => {
    const originalEvent = event.originalEvent as WheelEvent;
    if (
      originalEvent.deltaY !== 0 &&
      event.currentTarget.classList.contains('active')
    ) {
      event.preventDefault();
      event.stopPropagation();
      uss.scrollXBy(originalEvent.deltaY, event.currentTarget, null, false);
    }
  });

  scrollableDivs.each((_index, element) => {
    uss.setXStepLengthCalculator(easeFunction, element);
  });

  // Change the scroll direction relative to the screen width
  const processScrollDirection = () => {
    scrollableDivs.each((_index, element) => {
      if (Number($(window).width()) < 1000) {
        if (element.classList.contains('active'))
          element.classList.remove('active');
      } else {
        if (!element.classList.contains('active'))
          element.classList.add('active');
      }
    });
  };
  processScrollDirection();

  window.onresize = processScrollDirection;
};

// eslint-disable-next-line @typescript-eslint/ban-types
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

// Add shadow to the scroll elements
export const horizontalScrollShadow = () => {
  // Get scrollable elements
  const scrollableDivs = $('.horizontal-scroll-shadow');
  // Add shadow elements
  scrollableDivs.each((_index, element) => {
    if (!$(element).children('.shadow').length) {
      const shadow = $(`<div class="shadow"></div>`);

      shadow.css({
        maxHeight: element.clientHeight,
        maxWidth: element.clientWidth,
      });
      $(element).prepend(shadow);
    }
  });
  scrollableDivs.on('DOMNodeInserted', (event) => {
    $(event.currentTarget).children('.shadow').css({
      maxHeight: event.currentTarget.clientHeight,
      maxWidth: event.currentTarget.clientWidth,
    });
  });
  // Change shadow on scroll
  $(scrollableDivs).on('scroll', (event) => {
    const scrollTop = event.currentTarget.scrollTop;
    const scrollLeft = event.currentTarget.scrollLeft;
    const direction = scrollTop && !scrollLeft ? 'vertical' : 'horizontal';
    const shadowTop =
      direction === 'vertical' ? (scrollTop > 50 ? 50 : scrollTop / 50) : 0;
    const shadowLeft =
      direction === 'horizontal' ? (scrollLeft > 50 ? 50 : scrollLeft / 50) : 0;
    const shadowElement = $(event.currentTarget).children('.shadow');
    if (shadowTop) {
      shadowElement.addClass('top');
    } else {
      shadowElement.removeClass('top');
    }
    if (shadowLeft) {
      shadowElement.addClass('left');
    } else {
      shadowElement.removeClass('left');
    }
    shadowElement.css({ opacity: shadowTop || shadowLeft });
  });
};

// Allow vertical scrolling for react page
export const allowVerticalScroll = () => {
  document.body.style.overflowY = 'auto';
  return () => {
    document.body.style.overflowY = 'hidden';
  };
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

export const urlToObject = async (imageUrl: string) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const file = new File([blob], 'image.jpg', { type: blob.type });
  return file;
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
    diffDate.getHours() - 1,
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
    : day >= 1
    ? toString(sec, 'sec')
    : '';
};
