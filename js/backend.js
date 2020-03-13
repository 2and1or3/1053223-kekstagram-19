'use strict';

(function () {
  var GET_URL = 'https://js.dump.academy/kekstagram/data';
  var POST_URL = 'https://js.dump.academy/kekstagram';
  var TIMEOUT = 5000;
  var OK = 200;

  var makeRequest = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === OK) {
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
    return xhr;
  };

  var load = function (onSuccess, onError) {
    var request = makeRequest(onSuccess, onError);

    request.open('GET', GET_URL);
    request.send();
  };

  var upload = function (data, onError, onSuccess) {
    var request = makeRequest(onSuccess, onError);

    request.open('POST', POST_URL);
    request.send(data);
  };

  window.backend = {
    load: load,
    save: upload
  };
})();
