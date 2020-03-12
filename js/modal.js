'use strict';

(function () {
  var ESC = 'Escape';

  var onEscPress = function (evt) {
    if (evt.key === ESC && !isFocused()) {
      popupClose();
    }
  };

  var popupOpen = function (elem) {
    elem.classList.remove('hidden');
    elem.classList.add('js-open');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onEscPress);
  };

  var popupClose = function () {
    var opened = document.querySelector('.js-open');

    if (opened === window.form.imgRedactor) {
      window.form.resetRedactor();
    }

    opened.classList.add('hidden');
    opened.classList.remove('js-open');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onEscPress);
  };

  var isFocused = function () {
    var opened = document.querySelector('.js-open');
    var form = opened.closest('form') || opened.querySelector('form');

    if (form) {
      var arr = Array.from(form.elements);
      var filtered = arr.filter(function (elem) {
        return elem.matches('input:not([type=hidden])') &&
               elem.matches('input:not([type=radio])') &&
               elem.matches('input:not([type=checkbox])') &&
               elem.matches('input:not([type=file])') &&
               elem.matches('input:not([type=submit])') &&
               elem.matches('input:not([type=reset])') &&
               elem.matches('input:not([type=button])') &&
               elem.matches('input:not([type=number])') &&
               elem.matches('input:not([disabled])') &&
               elem.matches('input:not([readonly])') ||

               elem.matches('textarea');
      });

      return filtered.some(function (elem) {
        return elem.matches(':focus');
      });
    }

    return false;
  };

  window.modal = {
    open: popupOpen,
    close: popupClose
  };
})();