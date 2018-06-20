'use strict';
(function () {
  var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
  var URL_UPLOAD = 'https://js.dump.academy/keksobooking/';

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError('Произошла неизвестная ошибка, видимо мы где-то накосячили ¯\\_(ツ)_/¯ Пожалуйста, перезагрузите страницу!');
        }
      });
      xhr.addEventListener('error', function () {
        onError('Что-то случилось с сервером, видимо мы где-то накосячили ¯\\_(ツ)_/¯ Пожалуйста, перезагрузите страницу!');
      });
      xhr.addEventListener('timeout', function () {
        onError('Сервер долго не отвечает, видимо мы где-то накосячили ¯\\_(ツ)_/¯ Пожалуйста, перезагрузите страницу!');
      });

      xhr.open('GET', URL_LOAD);
      xhr.send();
    },

    upload: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad();
        } else {
          onError('Произошла неизвестная ошибка, видимо мы где-то накосячили ¯\\_(ツ)_/¯ Пожалуйста, отправьте форму еще раз!');
        }
      });
      xhr.addEventListener('error', function () {
        onError('Что-то случилось с сервером, видимо мы где-то накосячили ¯\\_(ツ)_/¯ Пожалуйста, отправьте форму еще раз!');
      });
      xhr.addEventListener('timeout', function () {
        onError('Сервер долго не отвечает, видимо мы где-то накосячили ¯\\_(ツ)_/¯ Пожалуйста, отправьте форму еще раз!');
      });

      xhr.open('POST', URL_UPLOAD);
      xhr.send(data);
    }
  };
})();
