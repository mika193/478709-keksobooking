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
  var activatePin = function (element) {
    deactivatePin();
    activePin = element;
    activePin.classList.add('map__pin--active');
  };

  /**
    * Удаляет класс у неактивного пин
    */
  var deactivatePin = function () {
    if (activePin) {
      activePin.classList.remove('map__pin--active');
      activePin = null;
    }
  };

  window.pin = {
    /**
     * Генерирует метку на карте из объекта с данными
     * @param {Ad} dataObject - объект с исходными данными
     * @return {Node}
     */
    create: function (dataObject) {
      var pin = mapPinTemplate.cloneNode(true);
      var pinImage = pin.querySelector('img');
      pin.style.left = (dataObject.location.x - pinParams.WIDTH / 2) + 'px';
      pin.style.top = (dataObject.location.y - pinParams.HEIGHT) + 'px';
      pinImage.src = dataObject.author.avatar;
      pinImage.alt = dataObject.offer.title;
      pin.addEventListener('click', function (evt) {
        if (activePin !== evt.currentTarget) {
          window.popup.open(dataObject);
          activatePin(evt.currentTarget);
        }
      });
      return pin;
    },

    deactivate: deactivatePin
  };
})();
