'use strict';

(function () {
  var mapPinsContainer = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  var mapPins = [];

  window.pins = {
    /**
     * Отрисовывает пины на странице
     * @param {Array.<Object>} array - массив исходных данных
     */
    create: function (array) {
      array.forEach(function (item) {
        var pin = window.pin.create(item);
        fragment.appendChild(pin);
        mapPins.push(pin);
      });
      mapPinsContainer.appendChild(fragment);
    },

    /**
     * Удаляет со страницы отрисованные пины
     */
    remove: function () {
      mapPins.forEach(function (item) {
        item.remove();
      });
      mapPins = [];
    }
  };
})();
