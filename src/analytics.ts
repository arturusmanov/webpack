import * as $ from 'jquery';

export default function createAnalytics(): object {
  let counter: number = 0;
  let isDestroyed: boolean = false;

  const listener = () => counter++;
  $(document).on('click', listener);


  return {
    destroy() {
      $(document).off('click', listener);
      isDestroyed = true;
    },

    getClicks() {
      if (isDestroyed) {
        return `Analytics is destroyed. Total clicks = ${counter}`;
      }
      return counter;
    }
  }
}

window['analytics'] = createAnalytics();