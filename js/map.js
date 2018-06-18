'use strict';
(function () {
  /** @constant {number} */
  var ESC_CODE = 27;

  /** @constant {number} */
  var NUMBER_OF_ADS = 8;

  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters-container');
  var mapPinsContainer = document.querySelector('.map__pins');
  var mainPin = document.querySelector('.map__pin--main');
  var pinInactiveCordY = mainPin.offsetTop;
  var pinInactiveCordX = mainPin.offsetLeft;
  var fragment = document.createDocumentFragment();
  var activePin;
  var activeCard;
  var mapPins = [];

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
   * Добавляет класс активному пин
   * @param {Node} element
   */
  var pinClassAd = function (element) {
    pinClassRemove();
    activePin = element;
    activePin.classList.add('map__pin--active');
  };

  /**
   * Удаляет класс у неактивного пин
   */
  var pinClassRemove = function () {
    if (activePin) {
      activePin.classList.remove('map__pin--active');
      activePin = null;
    }
  };

  /**
   * Открывает попап с объявлением, соответствующим нажатой метке
   * @param {Ad} dataObject - объект с исходными данными
   */
  var openPopup = function (dataObject) {
    closePopup();
    var card = window.createMapCard(dataObject);
    card.querySelector('.popup__close').addEventListener('click', function () {
      closePopup();
    });
    document.addEventListener('keydown', onPopupEscPress);
    activeCard = card;
    map.insertBefore(card, mapFilters);
  };

  /**
   * Закрывает попап с объявлением
   */
  var closePopup = function () {
    if (activeCard) {
      map.removeChild(activeCard);
      document.removeEventListener('keydown', onPopupEscPress);
      activeCard = null;
      pinClassRemove();
    }
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_CODE) {
      closePopup();
    }
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

  window.map = {
    init: function () {
      window.dataCreate(NUMBER_OF_ADS).forEach(function (item) {
        var pin = window.createPin(item);
        pin.addEventListener('click', function (evt) {
          if (activePin !== evt.currentTarget) {
            openPopup(item);
            pinClassAd(evt.currentTarget);
          }
        });
        fragment.appendChild(pin);
        mapPins.push(pin);
      });
      mapPinsContainer.appendChild(fragment);
      map.classList.remove('map--faded');
    },

    deactivate: function () {
      mapPins.forEach(function (item) {
        mapPinsContainer.removeChild(item);
      });
      mapPins = [];
      closePopup();
      mainPin.style.left = pinInactiveCordX + 'px';
      mainPin.style.top = pinInactiveCordY + 'px';
      window.form.setAdressValue(getMainPinCoords(false));
      map.classList.add('map--faded');
    }
  };

  window.form.setAdressValue(getMainPinCoords(false));
  mainPin.addEventListener('mousedown', onMainPinMouseDown);
})();
