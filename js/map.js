'use strict';

/** @constant {number} */
var NUMBER_OF_ADS = 8;

/** @constant {number} */
var MAXIMUM_ROOM_COUNT = 5;

/** @constant {number} */
var MAXIMUM_GUEST_COUNT = 100;

/** @constant {number} */
var ESC_CODE = 27;

/**
 * @typedef {Object} AvatarParams
 * @property {string} URL
 * @property {string} EXTENTION
 */
var avatarParams = {
  URL: 'img/avatars/user',
  EXTENSION: '.png'
};

/**
 * @typedef {Objeсt} XCordParams
 * @property {number} MINIMUM
 * @property {number} MAXIMUM
 */
var xCordParams = {
  MINIMUM: 300,
  MAXIMUM: 900
};

/**
 * @typedef {Objeсt} YCordParams
 * @property {number} MINIMUM
 * @property {number} MAXIMUM
 */
var yCordParams = {
  MINIMUM: 130,
  MAXIMUM: 630
};

/**
 * @typedef {Objeсt} PriceParams
 * @property {number} MINIMUM
 * @property {number} MAXIMUM
 */
var priceParams = {
  MINIMUM: 1000000,
  MAXIMUM: 1000
};

/**
 * @typedef {Objeсt} PinParams
 * @property {number} WIDTH
 * @property {number} HEIGHT
 */
var pinParams = {
  WIDTH: 50,
  HEIGHT: 70
};

/**
 * @typedef {Objeсt} MainPinParams
 * @property {number} WIDTH
 * @property {number} HEIGHT
 * @property {number} ACTIVE_HEIGHT
 */
var mainPinParams = {
  WIDTH: 65,
  HEIGHT: 65,
  ACTIVE_HEIGHT: 81
};

/**
 * @typedef {Objeсt} PhotoParams
 * @property {number} WIDTH
 * @property {number} HEIGHT
 * @property {string} ALT
 * @property {string} CLASS
 */
var photoParams = {
  WIDTH: 45,
  HEIGHT: 40,
  ALT: 'Фотография жилья',
  CLASS: 'popup__photo'
};

/**
 * @typedef {Object} OfferParams
 * @property {Array.<string>} PROPERTY_TITLES
 * @property {Array.<string>} TIMES
 * @property {Array.<string>} FEATURES
 * @property {Array.<string>} PHOTOS
 */
var offerParams = {
  PROPERTY_TITLES: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],

  TIMES: [
    '12:00',
    '13:00',
    '14:00'
  ],

  FEATURES: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ],

  PHOTOS: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ]
};

/**
 * @typedef {Object} OfferTypesTranslation
 * @property {string} 'flat'
 * @property {string} 'palace'
 * @property {string} 'house'
 * @property {string} 'bungalo'
 */
var offerTypesTranslation = {
  'flat': 'Квартира',
  'palace': 'Дворец',
  'house': 'Дом',
  'bungalo': 'Бунгало',
};

window.mapPinsContainer = document.querySelector('.map__pins');
var mapTemplate = document.querySelector('template');
var mapPinTemplate = mapTemplate.content.querySelector('.map__pin');
window.map = document.querySelector('.map');
var mapCardTemplate = mapTemplate.content.querySelector('.map__card');
window.noticeForm = document.querySelector('.ad-form');
var noticeFormFieldsets = window.noticeForm.querySelectorAll('fieldset');
var mainPin = document.querySelector('.map__pin--main');
var adressField = window.noticeForm.querySelector('#address');
var mapFilters = window.map.querySelector('.map__filters-container');
window.activatedPage = false;
var activeCard;
var activePin;
window.mapPins = [];

/**
 * Генерирует случайное число в заданном диапазоне
 * @param {number} min - минимальное значение генерируемого числа
 * @param {number} max - максимальное значение генерируемого числа
 * @return {number}
 */
var getRandomNumber = function (min, max) {
  return Math.random() * (max - min) + min;
};

/**
 * Генерирует путь к аватарке
 * @param {number} index - порядковый номер аватара
 * @return {string}
 */
var generateAvatarPath = function (index) {
  var avatarIndex = index;
  if (index < 10) {
    avatarIndex = '0' + index;
  }

  return avatarParams.URL + avatarIndex + avatarParams.EXTENSION;
};

/**
* Определяет тип собственности
* @param {string} element - строка, определяющая тип собственности
* @return {string}
*/
var createPropertyType = function (element) {
  var propertyType;

  if (/квартира/.test(element)) {
    propertyType = 'flat';
  } else if (/дворец/.test(element)) {
    propertyType = 'palace';
  } else if (/домик/.test(element)) {
    propertyType = 'house';
  } else if (/бунгало/.test(element)) {
    propertyType = 'bungalo';
  }

  return propertyType;
};

/**
 * Создает массив случайно расположенных элементов
 * @param {Array.<string>} array - массив с исходным списком строк
 * @param {number} length - необходимая длина массива
 * @param {boolean} unique - определяет будут ли повторяться элементы в новом массиве
 * @return {Array.<string>}
 */
var createRandomArray = function (array, length, unique) {

  var newArray = [];
  var i = 0;
  while (i < length) {
    var elementIndex = Math.floor(getRandomNumber(0, array.length));
    if ((newArray.indexOf(array[elementIndex]) !== -1) && (unique)) {
      continue;
    }

    i++;
    newArray.push(array[elementIndex]);
  }

  return newArray;
};

/**
 * @typedef {Object} Author
 * @property {string} avatar
 */

/**
 * @typedef {Object} Offer
 * @property {string} title
 * @property {string} adress
 * @property {number} price
 * @property {string} type
 * @property {number} rooms
 * @property {number} guests
 * @property {string} checkin
 * @property {string} checkout
 * @property {Array.<string>} features
 * @property {string} description
 * @property {Array.<string>} photos
 */

/**
 * @typedef {Object} Location
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Object} Ad
 * @property {Author}
 * @property {Offer}
 * @property {Location}
 */

/**
 * Генерирует объявление
 * @param {number} index - порядковый номер элемента из массива данных
 * @return {Ad}
 */
var getAd = function (index) {
  var locationX = Math.round(getRandomNumber(xCordParams.MINIMUM, xCordParams.MAXIMUM));
  var locationY = Math.round(getRandomNumber(yCordParams.MINIMUM, yCordParams.MAXIMUM));

  return {
    author: {
      avatar: generateAvatarPath(index + 1)
    },

    offer: {
      title: offerParams.PROPERTY_TITLES[index],
      address: locationX + ', ' + locationY,
      price: Math.round(getRandomNumber(priceParams.MINIMUM, priceParams.MAXIMUM)),
      type: createPropertyType(offerParams.PROPERTY_TITLES[index]),
      rooms: Math.ceil(getRandomNumber(1, MAXIMUM_ROOM_COUNT)),
      guests: Math.ceil(getRandomNumber(1, MAXIMUM_GUEST_COUNT)),
      checkin: offerParams.TIMES[Math.floor(getRandomNumber(0, offerParams.TIMES.length))],
      checkout: offerParams.TIMES[Math.floor(getRandomNumber(0, offerParams.TIMES.length))],
      features: createRandomArray(offerParams.FEATURES, Math.ceil(getRandomNumber(1, offerParams.FEATURES.length)), true),
      description: '',
      photos: createRandomArray(offerParams.PHOTOS, offerParams.PHOTOS.length, true)
    },

    location: {
      x: locationX,
      y: locationY
    }
  };
};

/**
 * Создает массив объектов похожих объявлений
 * @param {number} arrayLength - количество записываемых в массив объявлений
 * @return {Array.<Ad>}
 */
var getAds = function (arrayLength) {
  var ads = [];

  for (var i = 0; i < arrayLength; i++) {
    ads.push(getAd(i));
  }

  return ads;
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
  window.mapPins.push(mapPin);
  return mapPin;
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

/**
 * Открывает попап с объявлением, соответствующим нажатой метке
 * @param {Node} element - элемент, на котором произошел клик
 * @param {Ad} dataObject - объект с исходными данными
 */
var openPopup = function (element, dataObject) {
  if (activeCard) {
    window.deleteDisplayedAD();
  }
  var card = createMapCard(dataObject);
  window.map.insertBefore(card, mapFilters);
  activeCard = card;
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
    window.deleteDisplayedAD();
    pinClassRemove();
  });
  document.addEventListener('keydown', onPopupEscPress);
  return mapCard;
};

/**
 * Активирует карту на странице
 */
var initMap = function () {
  window.mapPinsContainer.appendChild(createPins(similarAds));
  window.map.classList.remove('map--faded');
};

/**
 * Делает форму объявления недоступной
 */
window.disableForm = function () {
  window.noticeForm.classList.add('ad-form--disabled');
  noticeFormFieldsets.forEach(function (item) {
    item.setAttribute('disabled', 'disabled');
  });
};
/**
 * Делает форму объявления доступной
 */
var initForm = function () {
  window.noticeForm.classList.remove('ad-form--disabled');
  noticeFormFieldsets.forEach(function (item) {
    item.removeAttribute('disabled');
  });
  window.onRoomNumberChange();
};

/**
 * Возвращает координаты главного пин в зависимости от состояния страницы
 * @param {boolean} active - отражает состояние страницы
 * @return {string}
 */
var getMainPinCoords = function (active) {
  var mainPinCordX = mainPin.offsetLeft + mainPinParams.WIDTH / 2;
  var mainPinCordY = (active) ? mainPin.offsetTop + mainPinParams.ACTIVE_HEIGHT : mainPin.offsetTop + mainPinParams.HEIGHT / 2;
  return mainPinCordX + ', ' + mainPinCordY;
};

/**
 * Передает координаты метки в поле Адрес
 * @param {boolean} value - означает состояние активности или неактивности карты
 */
window.setAdressValue = function (value) {
  adressField.value = getMainPinCoords(value);
};

/**
 * Удаляет отображенное объявление
 */
window.deleteDisplayedAD = function () {
  if (activeCard) {
    window.map.removeChild(activeCard);
  }
  document.removeEventListener('keydown', onPopupEscPress);
  activeCard = null;
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_CODE) {
    window.deleteDisplayedAD();
  }
};

/**
 * Активирует элементы на странице
 * @param {number} x - x-координата главной метки
 */
var initPageElements = function () {
  if (!window.activatedPage) {
    initMap();
    initForm();
    window.activatedPage = true;
  }
  window.setAdressValue(true);
};

/**
 * Активирует страницу
 */
var initPage = function () {
  window.disableForm();
  window.setAdressValue(false);

  mainPin.addEventListener('mouseup', function () {
    initPageElements();
  });
};

var similarAds = getAds(NUMBER_OF_ADS);
initPage();
