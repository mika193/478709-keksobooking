'use strict';

(function () {
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  var pinParams = {
    WIDTH: 50,
    HEIGHT: 70
  };

  /**
     * Генерирует метку на карте из объекта с данными
     * @param {Ad} dataObject - объект с исходными данными
     * @return {Node}
     */
  window.createPin = function (dataObject) {
    var mapPin = mapPinTemplate.cloneNode(true);
    var mapPinImage = mapPin.querySelector('img');
    mapPin.style.left = (dataObject.location.x - pinParams.WIDTH / 2) + 'px';
    mapPin.style.top = (dataObject.location.y - pinParams.HEIGHT) + 'px';
    mapPinImage.src = dataObject.author.avatar;
    mapPinImage.alt = dataObject.offer.title;
    return mapPin;
  };
})();
