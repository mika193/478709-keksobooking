'use strict';

(function () {
  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');

  var pinInactiveCord = {
    y: mainPin.offsetTop,
    x: mainPin.offsetLeft,
  };

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
    window.pins.create(window.filter.apply(array));
  };

  var onLoadError = function (errorMessage) {
    window.getErrorMessage(errorMessage);
  };

  window.form.setAdressValue(getMainPinCoords(false));
  mainPin.addEventListener('mousedown', onMainPinMouseDown);

  window.map = {
    init: function () {
      window.backend.load(onLoadSuccess, onLoadError);
      map.classList.remove('map--faded');
    },

    deactivate: function () {
      window.pins.remove();
      window.popup.close();
      mainPin.style.left = pinInactiveCord.x + 'px';
      mainPin.style.top = pinInactiveCord.y + 'px';
      window.form.setAdressValue(getMainPinCoords(false));
      map.classList.add('map--faded');
    }
  };
})();
