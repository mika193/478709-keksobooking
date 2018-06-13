'use strict';

var NUMBER_OF_ADS = 8;
var MAXIMUM_ROOM_COUNT = 5;
var MAXIMUM_GUEST_COUNT = 100;

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
 */
var mainPinParams = {
  WIDTH: 65,
  HEIGHT: 65
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

var mapPins = document.querySelector('.map__pins');
var mapTemplate = document.querySelector('template');
var mapPinTemplate = mapTemplate.content.querySelector('.map__pin');
var map = document.querySelector('.map');
var mapCardTemplate = mapTemplate.content.querySelector('.map__card');
var noticeForm = document.querySelector('.ad-form');
var noticeFormFieldsets = noticeForm.querySelectorAll('fieldset');
var mainPin = document.querySelector('.map__pin--main');
var adressField = noticeForm.querySelector('#address');

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

  return mapCard;
};

/**
 * Активирует карту на странице
 */
var initMap = function () {
  var pins = mapPins.querySelectorAll('.map__pin');
  if (pins) {
    for (var i = 1; i < pins.length; i++) {
      mapPins.removeChild(pins[i]);
    }
  }
  map.classList.remove('map--faded');
  mapPins.appendChild(createPins(similarAds));
};

/**
 * Делает форму объявления недоступной
 */
var disableForm = function () {
  noticeForm.classList.add('ad-form--disabled');
  noticeFormFieldsets.forEach(function (item) {
    item.setAttribute('disabled', 'disabled');
  });
};
/**
 * Делает форму объявления доступной
 */
var initForm = function () {
  noticeForm.classList.remove('ad-form--disabled');
  noticeFormFieldsets.forEach(function (item) {
    item.removeAttribute('disabled', 'disabled');
  });
};

/**
 * Передает координаты метки в поле Адрес
 * @param {number} leftCord - координата x
 * @param {number} topCord - координата y
 */
var setAdressDisabledValue = function (leftCord, topCord) {
  adressField.value = leftCord + ', ' + topCord;
};

/**
 * Вычисляет координаты метки на карте
 * @param {string} string - строка с исходными координатами
 * @param {number} gap - шаг изменения координат
 * @return {number}
 */
var getPinCord = function (string, gap) {
  return Number(string.slice(0, string.search(/px/))) - gap;
};

/**
 * Удаляет отображенное объявление
 */
var deleteDisplayedAD = function () {
  map.removeChild(map.querySelector('.map__card'));
  document.removeEventListener('keydown', onPopupEscPress);
};

/**
 * Генерирует текст объявления в соответствии с кликнутой меткой
 * @param {Node} element - метка, на которой осуществлен клик
 * @param {Array.<Node>} array - массив меток, отрисованных на странице
 */
var getAdForDisplay = function (element, array) {
  if (map.querySelector('.map__card')) {
    deleteDisplayedAD();
  }
  for (var i = 1; i < array.length; i++) {
    if (element === array[i]) {
      map.insertBefore(createMapCard(similarAds[i - 1]), map.querySelector('.map__filters-container'));
    }
  }
};

/**
 * Закрывает окно объявления при нажатии Esc
 * @param {Object} evt - объект с параметрами события нажатия на кнопку
 */
var onPopupEscPress = function (evt) {
  if (evt.keyCode === 27) {
    deleteDisplayedAD();
  }
};

/**
 * Открывает попап с объявлением
 * @param {Node} element - метка, на которой осуществлен клик
 * @param {Array.<Node>} array - массив меток, отрисованных на странице
 */
var openPopup = function (element, array) {
  getAdForDisplay(element, array);
  var popupCloseButton = map.querySelector('.popup__close');
  popupCloseButton.addEventListener('click', function () {
    deleteDisplayedAD();
  });
  document.addEventListener('keydown', onPopupEscPress);
};

/**
 * отображает объявление при нажатии на метку на карте
 */
var displayAd = function () {
  var pins = document.querySelectorAll('.map__pin');
  for (var i = 1; i < pins.length; i++) {
    pins[i].addEventListener('click', function (evt) {
      openPopup(evt.target, pins);
    });
  }
};

/**
 * Активирует страницу
 */
var initPage = function () {
  disableForm();
  setAdressDisabledValue(getPinCord(getComputedStyle(mainPin).left, mainPinParams.WIDTH / 2), getPinCord(getComputedStyle(mainPin).top, mainPinParams.HEIGHT / 2));

  mainPin.addEventListener('mouseup', function () {
    initMap();
    initForm();
    setAdressDisabledValue(getPinCord(getComputedStyle(mainPin).left, mainPinParams.WIDTH / 2), getPinCord(getComputedStyle(mainPin).top, mainPinParams.HEIGHT));
    displayAd();
  });
};

var similarAds = getAds(NUMBER_OF_ADS);
initPage();

