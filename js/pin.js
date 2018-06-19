'use strict';

(function () {
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var activePin;

  var pinParams = {
    WIDTH: 50,
    HEIGHT: 70
  };

    /**
   * Добавляет класс активному пин
   * @param {Node} element
   */
  var pinClassAd = function (element) {
    window.pin.classRemove();
    activePin = element;
    activePin.classList.add('map__pin--active');
  };

  window.pin = {
    /**
     * Генерирует метку на карте из объекта с данными
     * @param {Ad} dataObject - объект с исходными данными
     * @return {Node}
     */
    create: function (dataObject) {
      var mapPin = mapPinTemplate.cloneNode(true);
      var mapPinImage = mapPin.querySelector('img');
      mapPin.style.left = (dataObject.location.x - pinParams.WIDTH / 2) + 'px';
      mapPin.style.top = (dataObject.location.y - pinParams.HEIGHT) + 'px';
      mapPinImage.src = dataObject.author.avatar;
      mapPinImage.alt = dataObject.offer.title;
      mapPin.addEventListener('click', function (evt) {
        if (activePin !== evt.currentTarget) {
          window.popup.open(dataObject);
          pinClassAd(evt.currentTarget);
        }
      });
      return mapPin;
    },

    /**
    * Удаляет класс у неактивного пин
    */
    classRemove: function () {
      if (activePin) {
        activePin.classList.remove('map__pin--active');
        activePin = null;
      }
    }
  };
})();
