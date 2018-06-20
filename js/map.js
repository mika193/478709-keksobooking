'use strict';
(function () {
  var map = document.querySelector('.map');
  var mapPinsContainer = document.querySelector('.map__pins');
  var mainPin = document.querySelector('.map__pin--main');
  var pinInactiveCordY = mainPin.offsetTop;
  var pinInactiveCordX = mainPin.offsetLeft;
  var fragment = document.createDocumentFragment();
  var mapPins = [];

  var mainPinParams = {
    WIDTH: 65,
    HEIGHT: 65,
    ACTIVE_HEIGHT: 81,
    Y_COORD_MIN: 130,
    Y_COORD_MAX: 630,
    X_COORD_MIN: 0,
    X_COORD_MAX: 1200
  };

  var topCord = {
    min: mainPinParams.Y_COORD_MIN - mainPinParams.ACTIVE_HEIGHT,
    max: mainPinParams.Y_COORD_MAX - mainPinParams.ACTIVE_HEIGHT
  };

  var leftCord = {
    min: mainPinParams.X_COORD_MIN - Math.floor(mainPinParams.WIDTH / 2),
    max: mainPinParams.X_COORD_MAX - Math.floor(mainPinParams.WIDTH / 2)
  };

  /**
   * Возвращает координаты главного пин в зависимости от состояния страницы
   * @param {boolean} active - отражает состояние страницы
   * @return {string}
   */
  var getMainPinCoords = function (active) {
    var mainPinCordX = mainPin.offsetLeft + Math.floor(mainPinParams.WIDTH / 2);
    var mainPinCordY = (active) ? mainPin.offsetTop + mainPinParams.ACTIVE_HEIGHT : mainPin.offsetTop + Math.floor(mainPinParams.HEIGHT / 2);
    return mainPinCordX + ', ' + mainPinCordY;
  };

  /**
   * Удаляет пины со страницы
   */
  var deletePins = function () {
    mapPins.forEach(function (item) {
      mapPinsContainer.removeChild(item);
    });
    mapPins = [];
  };

  var onMainPinMouseDown = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMainPinMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      window.page.init();

      window.form.setAdressValue(getMainPinCoords(true));

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var newTopCord = mainPin.offsetTop - shift.y;
      var newLeftCord = mainPin.offsetLeft - shift.x;

      newTopCord = (newTopCord < topCord.min) ? topCord.min : newTopCord;
      newTopCord = ((newTopCord - shift.y) > topCord.max) ? topCord.max : newTopCord;

      newLeftCord = (newLeftCord < leftCord.min) ? leftCord.min : newLeftCord;
      newLeftCord = (newLeftCord > leftCord.max) ? leftCord.max : newLeftCord;

      mainPin.style.top = newTopCord + 'px';
      mainPin.style.left = newLeftCord + 'px';
    };

    var onMainPinMouseUp = function (upEvt) {
      upEvt.preventDefault();
      window.page.init();
      window.form.setAdressValue(getMainPinCoords(true));
      document.removeEventListener('mousemove', onMainPinMouseMove);
      document.removeEventListener('mouseup', onMainPinMouseUp);
    };
    document.addEventListener('mousemove', onMainPinMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
  };

  var onLoadSuccess = function (array) {
    array.forEach(function (item) {
      var pin = window.pin.create(item);
      fragment.appendChild(pin);
      mapPins.push(pin);
    });
    mapPinsContainer.appendChild(fragment);
  };

  var onLoadError = function (errorMessage) {
    window.getErrorMessage(errorMessage, map);
  };

  window.form.setAdressValue(getMainPinCoords(false));
  mainPin.addEventListener('mousedown', onMainPinMouseDown);

  window.map = {
    init: function () {
      window.backend.load(onLoadSuccess, onLoadError);
      map.classList.remove('map--faded');
    },

    deactivate: function () {
      deletePins();
      window.popup.close();
      mainPin.style.left = pinInactiveCordX + 'px';
      mainPin.style.top = pinInactiveCordY + 'px';
      window.form.setAdressValue(getMainPinCoords(false));
      map.classList.add('map--faded');
    }
  };
})();
