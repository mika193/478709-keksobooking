'use strict';

(function () {
  var SUCCESS_CODE = 200;

  var urlType = {
    LOAD: 'https://js.dump.academy/keksobooking/data',
    UPLOAD: 'https://js.dump.academy/keksobooking/'
  };

  var loadErrorText = {
    unknown: 'Произошла неизвестная ошибка, видимо мы где-то накосячили ¯\\_(ツ)_/¯ Пожалуйста, перезагрузите страницу!',
    timeout: 'Сервер долго не отвечает, видимо мы где-то накосячили ¯\\_(ツ)_/¯ Пожалуйста, перезагрузите страницу!',
    server: 'Что-то случилось с сервером, видимо мы где-то накосячили ¯\\_(ツ)_/¯ Пожалуйста, перезагрузите страницу!'
  };

  var uploadErrorText = {
    unknown: 'Произошла неизвестная ошибка, видимо мы где-то накосячили ¯\\_(ツ)_/¯ Пожалуйста, отправьте форму еще раз!',
    timeout: 'Сервер долго не отвечает, видимо мы где-то накосячили ¯\\_(ツ)_/¯ Пожалуйста, перезагрузите страницу!',
    server: 'Что-то случилось с сервером, видимо мы где-то накосячили ¯\\_(ツ)_/¯ Пожалуйста, перезагрузите страницу!'
  };

  var getXhr = function (onLoad, onError, method, errorText, url, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onLoad((method === 'POST') ? '' : xhr.response);
      } else {
        onError(errorText.unknown);
      }
    });

    xhr.addEventListener('error', function () {
      onError(errorText.server);
    });

    xhr.addEventListener('timeout', function () {
      onError(errorText.timeout);
    });

    xhr.open(method, url);
    xhr.send((data) ? data : '');
  };

  window.backend = {
    load: function (onLoad, onError) {
      getXhr(onLoad, onError, 'GET', loadErrorText, urlType.LOAD);
    },

    upload: function (data, onLoad, onError) {
      getXhr(onLoad, onError, 'POST', uploadErrorText, urlType.UPLOAD, data);
    }
  };
})();
