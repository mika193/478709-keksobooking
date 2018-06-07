'use strict';

var NUMBER_OF_ADS = 8;
var MAXIMUM_ROOM_COUNT = 5;
var MAXIMUM_GUEST_COUNT = 100;

var avatar = {
  FIRST_NUMBER: 0,
  URL: 'img/avatars/user',
  EXTENSION: '.png'
};

var xCord = {
  MINIMUM: 300,
  MAXIMUM: 900
};

var yCord = {
  MINIMUM: 130,
  MAXIMUM: 630
};

var price = {
  MINIMUM: 1000000,
  MAXIMUM: 1000
};

var pin = {
  WIDTH: 50,
  HEIGHT: 70
};

var characteristicsList = {
  propertyTitles: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],

  times: [
    '12:00',
    '13:00',
    '14:00'
  ],

  features: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ],

  photos: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ]
};

var offerTypesTranslation = {
  'flat': 'Квартира',
  'palace': 'Дворец',
  'house': 'Дом',
  'bungalo': 'Бунгало',
};

var mapPins = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var map = document.querySelector('.map');
var mapCard = document.querySelector('template').content.querySelector('.map__card').cloneNode(true);
var featuresBlock = mapCard.querySelector('.popup__features');
var photoBlock = mapCard.querySelector('.popup__photos');

/**
 * Генерирует случайное число в заданном диапазоне
 * @param {number} minimum - минимальное значение генерируемого числа
 * @param {number} maximum - максимальное значение генерируемого числа
 * @return {number}
 */
var generateRandomNumber = function (minimum, maximum) {
  return Math.random() * (maximum - minimum) + minimum;
};

/**
 * Генерирует путь к аватарке
 * @param {number} index - порядковый номер аватара
 * @return {string}
 */
var generateAvatarPath = function (index) {
  return avatar.URL + avatar.FIRST_NUMBER + (index + 1) + avatar.EXTENSION;
};

/**
* Создает массив типов собственности и приводит его в соответствие с массивом заголовков предложений
* @param {Array.<string>} array - массив заголовков предложений
* @return {Array.<string>}
*/
var createPropertyTypesArray = function (array) {
  var propertyTypesList = [];
  for (var i = 0; i < array.length; i++) {
    if (/квартира/.test(array[i])) {
      propertyTypesList[i] = 'flat';
    } else {
      if (/дворец/.test(array[i])) {
        propertyTypesList[i] = 'palace';
      } else {
        if (/домик/.test(array[i])) {
          propertyTypesList[i] = 'house';
        } else {
          if (/бунгало/.test(array[i])) {
            propertyTypesList[i] = 'bungalo';
          }
        }
      }
    }
  }

  return propertyTypesList;
};

/**
 * Создает массив случайно расположенных элементов
 * @param {Array.<string>} array - массив с исходным списком строк
 * @param {number} length - необходимая длина массива
 * @return {Array.<string>}
 */
var createRandomArray = function (array, length) {

  var newArray = [];
  for (var i = 0; i < length; i++) {
    var elementIndex = Math.floor(generateRandomNumber(0, array.length));
    if (newArray.indexOf(array[elementIndex]) !== -1) {
      i = i - 1;
      continue;
    }

    newArray[i] = array[elementIndex];
  }

  return newArray;
};

/**
 * Генерирует объявление
 * @param {number} index - порядковый номер элемента из массива данных
 * @param {Object} list - объект с массивами исходных данных
 * @return {Object}
 */
var generateSimilarAd = function (index, list) {
  var locationX = Math.round(generateRandomNumber(xCord.MINIMUM, xCord.MAXIMUM));
  var locationY = Math.round(generateRandomNumber(yCord.MINIMUM, yCord.MAXIMUM));

  var similarAd = {
    author: {
      avatar: generateAvatarPath(index)
    },

    offer: {
      title: list.propertyTitles[index],
      address: locationX + ', ' + locationY,
      price: Math.round(generateRandomNumber(price.MINIMUM, price.MAXIMUM)),
      type: createPropertyTypesArray(list.propertyTitles)[index],
      rooms: Math.ceil(generateRandomNumber(1, MAXIMUM_ROOM_COUNT)),
      guests: Math.ceil(generateRandomNumber(1, MAXIMUM_GUEST_COUNT)),
      checkin: list.times[Math.floor(generateRandomNumber(0, list.times.length))],
      checkout: list.times[Math.floor(generateRandomNumber(0, list.times.length))],
      features: createRandomArray(list.features, Math.ceil(generateRandomNumber(1, list.features.length))),
      description: '',
      photos: createRandomArray(list.photos, list.photos.length)
    },

    location: {
      x: locationX,
      y: locationY
    }
  };

  return similarAd;
};

/**
 * Создает массив объектов похожих объявлений
 * @param {number} arrayLength - количество записываемых в массив объявлений
 * @param {Object} list - объект, содержащий исходные параметры
 * @return {Array.<Object>}
 */
var generateSimilarAds = function (arrayLength, list) {
  var similarAds = [];

  for (var i = 0; i < arrayLength; i++) {
    similarAds[i] = generateSimilarAd(i, list);
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
  mapPin.style.left = (array[index].location.x - pin.WIDTH / 2) + 'px';
  mapPin.style.top = (array[index].location.y - pin.HEIGHT) + 'px';
  mapPinImage.src = array[index].author.avatar;
  mapPinImage.alt = array[index].offer.title;
  return mapPin;
};

/**
 * Создает DOM-элементы, соответствующие меткам на карте
 * @param {Array.<Object>} array - массив объектов с исходными данными
 * @return {Node}
 */
var createMapPinsFromArray = function (array) {
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
 * Генерирует список характеристик из массива
 * @param {Array.<string>} array - массив с исходными данными
 * @return {Node}
 */
var addFeatures = function (array) {
  var mapOldFeature = featuresBlock.querySelectorAll('.popup__feature');
  for (var i = 0; i < mapOldFeature.length; i++) {
    mapOldFeature[i].remove();
  }
  var fragment = document.createDocumentFragment();
  for (var j = 0; j < array.length; j++) {
    fragment.appendChild(createFeature(array[j]));
  }
  return fragment;
};

/**
 * Создает DOM-элементы (набор изображений) и добавляет их в родительский блок
 * @param {Array.<string>} element - объект, содержащий данные для создания DOM-элементов
 * @return {Node}
 */
var addPhotoImage = function (element) {
  var mapCardPhoto = photoBlock.querySelector('.popup__photo');
  mapCardPhoto.remove();
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < element.length; i++) {
    mapCardPhoto = mapCardPhoto.cloneNode(true);
    mapCardPhoto.src = element[i];

    fragment.appendChild(mapCardPhoto);
  }

  return fragment;
};

/**
 * Создает DOM-элемент объявления
 * @param {Object} element - объект, содержащий данные для создания DOM-элементов
 * @return {Node}
 */
var createMapCard = function (element) {
  mapCard.querySelector('.popup__title').textContent = element.offer.title;
  mapCard.querySelector('.popup__text--address').textContent = element.offer.adress;
  mapCard.querySelector('.popup__text--price').textContent = element.offer.price + '₽/ночь';
  mapCard.querySelector('.popup__type').textContent = offerTypesTranslation[element.offer.type];
  mapCard.querySelector('.popup__text--capacity').textContent = element.offer.rooms + ' комнаты для ' + element.offer.guests + ' гостей';
  mapCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + element.offer.checkin + ', выезд до ' + element.offer.checkout;
  mapCard.querySelector('.popup__description').textContent = element.offer.description;
  featuresBlock.appendChild(addFeatures(element.offer.features));
  photoBlock.appendChild(addPhotoImage(element.offer.photos));
  mapCard.querySelector('.popup__avatar').textContent = element.author.avatar;

  return mapCard;
};

/**
 * Активирует карту на странице
 */
var initMap = function () {
  map.classList.remove('map--faded');

  var similarAds = generateSimilarAds(NUMBER_OF_ADS, characteristicsList);

  mapPins.appendChild(createMapPinsFromArray(similarAds));
  map.insertBefore(createMapCard(similarAds[0]), map.querySelector('.map__filters-container'));
};

initMap();

