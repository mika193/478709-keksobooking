'use strict';

(function () {
  var mapPinsContainer = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();
  var mapPins = [];

  window.pins = {
    create: function (array) {
      array.forEach(function (item) {
        var pin = window.pin.create(item);
        fragment.appendChild(pin);
        mapPins.push(pin);
      });
      mapPinsContainer.appendChild(fragment);
    },

    remove: function () {
      mapPins.forEach(function (item) {
        item.remove();
      });
      mapPins = [];
    }
  };
})();
