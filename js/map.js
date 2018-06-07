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
 * @typedef {Objeсt} PinCordParams
 * @property {number} WIDTH
 * @property {number} HEIGHT
 */
var pinParams = {
  WIDTH: 50,
  HEIGHT: 70
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
  var similarAds = [];

  for (var i = 0; i < arrayLength; i++) {
    similarAds.push(getAd(i));
  }

  return similarAds;
};

/**
 * Генерирует метку на карте из массива данных
 * @param {Array.<Object>} array - массив с исходными данными
 * @param {number} index - порядковый номер элемента в массиве
 * @return {Node}
 */
var createMapPinFromArray = function (array, index) {
  var mapPin = mapPinTemplate.cloneNode(true);
  var mapPinImage = mapPin.querySelector('img');
  mapPin.style.left = (array[index].location.x - pinParams.WIDTH / 2) + 'px';
  mapPin.style.top = (array[index].location.y - pinParams.HEIGHT) + 'px';
  mapPinImage.src = array[index].author.avatar;
  mapPinImage.alt = array[index].offer.title;
  return mapPin;
};

/**
 * Создает DOM-элементы, соответствующие меткам на карте
 * @param {Array.<Ad>} array - массив объектов с исходными данными
 * @return {Node}
 */
var createPins = function (array) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < array.length; i++) {
    fragment.appendChild(createMapPinFromArray(array, i));
  }

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
 * Создает DOM-элементы (набор изображений) и добавляет их в родительский блок
 * @param {Node} element - исходный DOM-элемент
 * @param {string} link - адрес картинки
 * @return {Node}
 */
var addPhotoImage = function (element, link) {
  element = element.cloneNode(true);
  element.src = link;
  return element;
};


/**
 * Генерирует строку текста с правильными окончаниями
 * @param {number} numberRooms - количество комнат
 * @param {number} numberGuests - количество гостей
 * @return {string}
 */
var getString = function (numberRooms, numberGuests) {
  var rooms = ' комнат для ';
  var guests = ' гостей';

  if ((numberRooms + 10) % 10 === 1) {
    rooms = ' комната для ';
  } else if ((numberRooms + 10) % 10 > 1 && (numberRooms + 10) % 10 < 5) {
    rooms = ' комнаты для ';
  }

  if ((numberGuests + 10) % 10 === 1) {
    guests = ' гостя';
  }

  return numberRooms + rooms + numberGuests + guests;
};

/**
 * Создает DOM-элемент объявления
 * @param {Ad} object - объект, содержащий данные для создания DOM-элементов
 * @return {Node}
 */
var createMapCard = function (object) {
  var mapCard = mapCardTemplate.cloneNode(true);
  var featuresBlock = mapCard.querySelector('.popup__features');
  var photoBlock = mapCard.querySelector('.popup__photos');
  mapCard.querySelector('.popup__title').textContent = object.offer.title;
  mapCard.querySelector('.popup__text--address').textContent = object.offer.adress;
  mapCard.querySelector('.popup__text--price').textContent = object.offer.price + '₽/ночь';
  mapCard.querySelector('.popup__type').textContent = offerTypesTranslation[object.offer.type];
  mapCard.querySelector('.popup__text--capacity').textContent = getString(object.offer.rooms, object.offer.guests);
  mapCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + object.offer.checkin + ', выезд до ' + object.offer.checkout;
  mapCard.querySelector('.popup__description').textContent = object.offer.description;

  var featureFragment = document.createDocumentFragment();
  for (var i = 0; i < object.offer.features.length; i++) {
    featureFragment.appendChild(createFeature(object.offer.features[i]));
  }

  featuresBlock.appendChild(featureFragment);

  var photoItem = photoBlock.querySelector('.popup__photo');
  photoItem.remove();
  var photoFragment = document.createDocumentFragment();
  for (var j = 0; j < object.offer.photos.length; j++) {
    photoFragment.appendChild(addPhotoImage(photoItem, object.offer.photos[j]));
  }
  photoBlock.appendChild(photoFragment);

  mapCard.querySelector('.popup__avatar').textContent = object.author.avatar;

  return mapCard;
};

/**
 * Активирует карту на странице
 */
var initMap = function () {
  map.classList.remove('map--faded');

  var similarAds = getAds(NUMBER_OF_ADS);

  mapPins.appendChild(createPins(similarAds));
  map.insertBefore(createMapCard(similarAds[0]), map.querySelector('.map__filters-container'));
};

initMap();

