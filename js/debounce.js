'use strict';

(function () {
  var DEBOUNCE_TIMEOUT = 500;
  var timeout = null;

  var debounce = function (cb) {

    return function () {
      var parametrs = arguments;

      if (timeout) {
        window.clearTimeout(timeout);
      }

      timeout = setTimeout(function () {
        cb.apply(null, parametrs);
      }, DEBOUNCE_TIMEOUT);
    };
  };

  window.debounce = debounce;
})();
