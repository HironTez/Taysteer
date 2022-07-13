import $ from 'jquery';

// Horizontal scroll
export const horizontalScroll = () => {
  const scrollableDivs = $('.horizontal-scroll');

  const easeFunction = (remainingScrollDistance: number) => {
    return remainingScrollDistance / 15 + 1;
  };

  uss.hrefSetup();

  scrollableDivs?.on('mousewheel', (event) => {
    event.preventDefault();
    const originalEvent = event.originalEvent as WheelEvent;
    if (
      originalEvent.deltaY !== 0 &&
      event.currentTarget.classList.contains('active')
    ) {
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
      if ($(window).width()! < 1000) {
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
