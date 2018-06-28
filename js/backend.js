'use strict';

(function () {
  /** @constant {number} */
  var SUCCESS_CODE = 200;

  var urlType = {
    LOAD: 'https://js.dump.academy/keksobooking/data',
    UPLOAD: 'https://js.dump.academy/keksobooking/'
  };

  var LoadErrorText = {
    UNKNOWN: 'Произошла неизвестная ошибка, видимо мы где-то накосячили ¯\\_(ツ)_/¯ Пожалуйста, перезагрузите страницу!',
    TIMEOUT: 'Сервер долго не отвечает, видимо мы где-то накосячили ¯\\_(ツ)_/¯ Пожалуйста, перезагрузите страницу!',
    SERVER: 'Что-то случилось с сервером, видимо мы где-то накосячили ¯\\_(ツ)_/¯ Пожалуйста, перезагрузите страницу!'
  };

  var UploadErrorText = {
    UNKNOWN: 'Произошла неизвестная ошибка, видимо мы где-то накосячили ¯\\_(ツ)_/¯ Пожалуйста, отправьте форму еще раз!',
    TIMEOUT: 'Сервер долго не отвечает, видимо мы где-то накосячили ¯\\_(ツ)_/¯ Пожалуйста, перезагрузите страницу!',
    SERVER: 'Что-то случилось с сервером, видимо мы где-то накосячили ¯\\_(ツ)_/¯ Пожалуйста, перезагрузите страницу!'
  };

  /**
   * создает Xhr
   * @param {function} onLoad - функция, запускающаяся при успешной загрузке данных
   * @param {function} onError - функция, запускающаяся при неудачной загрузке данных
   * @param {string} method - метод отправки данных на сервер
   * @param {Object} errorText - объект, содержащий тексты, выводимые при ошибках
   * @param {string} url - адрес, на который отправляются данные
   * @param {Object} [data] - данные формы, отправляемые на сервер
   */
  var getXhr = function (onLoad, onError, method, errorText, url, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onLoad((method === 'POST') ? '' : xhr.response);
      } else {
        onError(errorText.UNKNOWN);
      }
    });

    xhr.addEventListener('error', function () {
      onError(errorText.SERVER);
    });

    xhr.addEventListener('timeout', function () {
      onError(errorText.TIMEOUT);
    });

    xhr.open(method, url);
    xhr.send((data) ? data : '');
  };

  window.backend = {
    load: function (onLoad, onError) {
      getXhr(onLoad, onError, 'GET', LoadErrorText, urlType.LOAD);
    },

    upload: function (data, onLoad, onError) {
      getXhr(onLoad, onError, 'POST', UploadErrorText, urlType.UPLOAD, data);
    }
  };
})();
