'use strict';
(function () {
  /** @constant {number} */
  var ESC_CODE = 27;

  var map = document.querySelector('.map');
  var mapPinsContainer = document.querySelector('.map__pins');
  var mapPins = [];
  var mapTemplate = document.querySelector('template');
  var mapPinTemplate = mapTemplate.content.querySelector('.map__pin');
  var mapCardTemplate = mapTemplate.content.querySelector('.map__card');
  var mapFilters = map.querySelector('.map__filters-container');
  var activePin;
  var activeCard;

  var pinParams = {
    WIDTH: 50,
    HEIGHT: 70
  };

  var offerTypesTranslation = {
    'flat': 'Квартира',
    'palace': 'Дворец',
    'house': 'Дом',
    'bungalo': 'Бунгало',
  };

  var photoParams = {
    WIDTH: 45,
    HEIGHT: 40,
    ALT: 'Фотография жилья',
    CLASS: 'popup__photo'
  };

    /**
   * Генерирует элемент списка характеристик
   * @param {string} text - текст, прибавляемый к классу элемента
   * @return {Node}
   */
  var createFeature = function (text) {
    var mapNewFeature = document.createElement('li');
    mapNewFeature.classList.add('popup__feature');
    mapNewFeature.classList.add('popup__feature--' + text);
    return mapNewFeature;
  };

  /**
   * Создает DOM-элемент (изображение)
   * @param {string} link - адрес картинки
   * @return {Node}
   */
  var createPhotoImage = function (link) {
    var element = document.createElement('img');
    element.src = link;
    element.style.width = photoParams.WIDTH + 'px';
    element.style.height = photoParams.HEIGHT + 'px';
    element.alt = photoParams.ALT;
    element.classList.add(photoParams.CLASS);
    return element;
  };

  /**
   * Возвращает слово с правильным окончанием
   * @param {number} number - число в соответствии с которым изменяется слово
   * @param {Array.<string>} array - массив вариантов написания слова в порядке: единственное число, множественное для number от 2 до 4 включительно, множественное для number от 5 включительно
   * @return {string}
   */
  var getDeclension = function (number, array) {
    if ((number % 100 < 20) && (number % 100 >= 5)) {
      return array[2];
    }
    if (number % 10 === 1) {
      return array[0];
    } else if ((number % 10 > 1) && (number % 10 < 5)) {
      return array[1];
    } else {
      return array[2];
    }
  };

    /**
   * Создает DOM-элемент объявления
   * @param {Ad} dataObject - объект, содержащий данные для создания DOM-элементов
   * @return {Node}
   */
  var createMapCard = function (dataObject) {
    var mapCard = mapCardTemplate.cloneNode(true);
    var featuresBlock = mapCard.querySelector('.popup__features');
    var photoBlock = mapCard.querySelector('.popup__photos');
    mapCard.querySelector('.popup__avatar').src = dataObject.author.avatar;
    mapCard.querySelector('.popup__title').textContent = dataObject.offer.title;
    mapCard.querySelector('.popup__text--address').textContent = dataObject.offer.adress;
    mapCard.querySelector('.popup__text--price').textContent = dataObject.offer.price + '₽/ночь';
    mapCard.querySelector('.popup__type').textContent = offerTypesTranslation[dataObject.offer.type];
    mapCard.querySelector('.popup__text--capacity').textContent = dataObject.offer.rooms + ' ' + getDeclension(dataObject.offer.rooms, ['комната', 'комнаты', 'комнат']) + ' для ' + dataObject.offer.guests + ' ' + getDeclension(dataObject.offer.guests, ['гостя', 'гостей', 'гостей']);
    mapCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + dataObject.offer.checkin + ', выезд до ' + dataObject.offer.checkout;
    mapCard.querySelector('.popup__description').textContent = dataObject.offer.description;

    dataObject.offer.features.forEach(function (item) {
      featuresBlock.appendChild(createFeature(item));
    });

    dataObject.offer.photos.forEach(function (item) {
      photoBlock.appendChild(createPhotoImage(item));
    });

    mapCard.querySelector('.popup__avatar').textContent = dataObject.author.avatar;
    mapCard.querySelector('.popup__close').addEventListener('click', function () {
      deleteDisplayedAD();
    });
    document.addEventListener('keydown', onPopupEscPress);
    return mapCard;
  };

  /**
   * Генерирует метку на карте из объекта с данными
   * @param {Ad} dataObject - объект с исходными данными
   * @return {Node}
   */
  var createMapPinFromArray = function (dataObject) {
    var mapPin = mapPinTemplate.cloneNode(true);
    var mapPinImage = mapPin.querySelector('img');
    mapPin.style.left = (dataObject.location.x - pinParams.WIDTH / 2) + 'px';
    mapPin.style.top = (dataObject.location.y - pinParams.HEIGHT) + 'px';
    mapPinImage.src = dataObject.author.avatar;
    mapPinImage.alt = dataObject.offer.title;
    mapPin.addEventListener('click', function (evt) {
      if (activePin !== evt.currentTarget) {
        openPopup(evt.currentTarget, dataObject);
        pinClassAd(evt.currentTarget);
      }
    });
    mapPins.push(mapPin);
    return mapPin;
  };

  /**
   * Добавляет класс активному пин
   * @param {Node} element
   */
  var pinClassAd = function (element) {
    if (activePin) {
      pinClassRemove();
    }
    activePin = element;
    activePin.classList.add('map__pin--active');
  };

  /**
   * Удаляет класс у неактивного пин
   */
  var pinClassRemove = function () {
    activePin.classList.remove('map__pin--active');
    activePin = null;
  };

  /**
   * Открывает попап с объявлением, соответствующим нажатой метке
   * @param {Node} element - элемент, на котором произошел клик
   * @param {Ad} dataObject - объект с исходными данными
   */
  var openPopup = function (element, dataObject) {
    if (activeCard) {
      deleteDisplayedAD();
    }
    var card = createMapCard(dataObject);
    map.insertBefore(card, mapFilters);
    activeCard = card;
  };

  /**
   * Удаляет отображенное объявление
   */
  var deleteDisplayedAD = function () {
    if (activeCard) {
      map.removeChild(activeCard);
    }
    document.removeEventListener('keydown', onPopupEscPress);
    activeCard = null;
    if (activePin) {
      pinClassRemove();
    }
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_CODE) {
      deleteDisplayedAD();
    }
  };

  /**
   * Создает DOM-элементы, соответствующие меткам на карте
   * @param {Array.<Ad>} array - массив объектов с исходными данными
   * @return {Node}
   */
  var createPins = function (array) {
    var fragment = document.createDocumentFragment();

    array.forEach(function (item) {
      fragment.appendChild(createMapPinFromArray(item));
    });

    return fragment;
  };

  window.map = {
    init: function () {
      mapPinsContainer.appendChild(createPins(window.similarAds));
      map.classList.remove('map--faded');
    },

    deactivate: function () {
      mapPins.forEach(function (item) {
        mapPinsContainer.removeChild(item);
      });
      mapPins = [];
      deleteDisplayedAD();
      map.classList.add('map--faded');
    }
  };
})();
