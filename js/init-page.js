'use strict';
(function () {
  var activatedPage = false;
  var resetButton = document.querySelector('.ad-form__reset');
  var adressField = document.querySelector('#address');
  var mainPin = document.querySelector('.map__pin--main');
  var pinInactiveCordY = mainPin.offsetTop;
  var pinInactiveCordX = mainPin.offsetLeft;

  var mainPinParams = {
    WIDTH: 65,
    HEIGHT: 65,
    ACTIVE_HEIGHT: 81,
    yCordMin: 130,
    yCordMax: 630,
    xCordMin: 0,
    xCordMax: 1200
  };

  var topCord = {
    min: mainPinParams.yCordMin - mainPinParams.ACTIVE_HEIGHT,
    max: mainPinParams.yCordMax - mainPinParams.ACTIVE_HEIGHT
  };

  var leftCord = {
    min: mainPinParams.xCordMin - Math.floor(mainPinParams.WIDTH / 2),
    max: mainPinParams.xCordMax - Math.floor(mainPinParams.WIDTH / 2)
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
   * Передает координаты метки в поле Адрес
   * @param {boolean} value - означает состояние активности или неактивности карты
   */
  var setAdressValue = function (value) {
    adressField.value = getMainPinCoords(value);
  };

  /**
   * Активирует элементы на странице
   * @param {number} x - x-координата главной метки
   */
  var initPageElements = function () {
    window.map.init();
    window.form.init();
    window.activatedPage = true;
  };

  var onMainPinMouseDown = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMainPinMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      if (!activatedPage) {
        initPageElements();
      }

      setAdressValue(true);

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
      if (!activatedPage) {
        initPageElements();
      }
      setAdressValue(true);
      document.removeEventListener('mousemove', onMainPinMouseMove);
      document.removeEventListener('mouseup', onMainPinMouseUp);
    };
    document.addEventListener('mousemove', onMainPinMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
  };

  /**
   * Деактивирует страницу
   */
  var deactivatePage = function () {
    window.map.deactivate();
    window.form.deactivate();
    activatedPage = false;
    mainPin.style.left = pinInactiveCordX + 'px';
    mainPin.style.top = pinInactiveCordY + 'px';
    setAdressValue(false);
  };

  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    deactivatePage();
  });

  window.form.disable();
  setAdressValue(false);
  mainPin.addEventListener('mousedown', onMainPinMouseDown);
})();
