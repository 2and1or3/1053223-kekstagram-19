'use strict';

(function () {
  var URL = 'https://js.dump.academy/kekstagram/data';
  var TIMEOUT = 5000;

  var load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError('Произошла ошибка сервера:' + xhr.status + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка клиента:' + xhr.status + xhr.statusText);
    });

    xhr.addEventListener('timeout', function () {
      onError('Превышено время запроса: ' + TIMEOUT + 'ms');
    });

    xhr.timeout = TIMEOUT;

    xhr.open('GET', URL);
    xhr.send();
  };

  window.backend = load;
})();
