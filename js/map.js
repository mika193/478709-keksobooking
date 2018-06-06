'use strict';

var NUMBER_OF_ADS = 8;
var AVATAR_FIRST_NUMBER = 0;
var AVATAR_URL = 'img/avatars/user';
var AVATAR_EXTENSION = '.png';
var MINIMUM_X_CORD = 300;
var MAXIMUM_X_CORD = 900;
var MINIMUM_Y_CORD = 130;
var MAXIMUM_Y_CORD = 630;
var MAXIMUM_PRICE = 1000000;
var MINIMUM_PRICE = 1000;
var MAXIMUM_ROOM_COUNT = 5;
var MAXIMUM_GUEST_COUNT = 100;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

var propertyTitlesList = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var checkinTimesList = [
  '12:00',
  '13:00',
  '14:00'
];

var checkoutTimesList = [
  '12:00',
  '13:00',
  '14:00'
];

var featuresList = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var photosList = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

/**
* Создает массив типов собственности propertyTypesList и одновременно приводит его в соответствие с массивом заголовков предложений propertyTitlesList
* @param {Array.<string>} array - массив заголовков предложений
* @return {Array.<string>}
*/
var createPropertyTypesArray = function (array) {
  var propertyTypesList = [];
  for (var i = 0; i < array.length; i++) {
    var arraySplit = array[i].split(' ');

    for (var j = 0; j < arraySplit.length; j++) {
      if (arraySplit[j] === 'квартира') {
        propertyTypesList[i] = 'flat';
      }

      if (arraySplit[j] === 'дворец') {
        propertyTypesList[i] = 'palace';
      }

      if (arraySplit[j] === 'домик') {
        propertyTypesList[i] = 'house';
      }

      if (arraySplit[j] === 'бунгало') {
        propertyTypesList[i] = 'bungalo';
      }
    }
  }
  return propertyTypesList;
};

/**
 * Создает массив строк случайной длинны
 * @param {Array.<string>} array - массив с исходным списком строк
 * @return {Array.<string>}
 */
var createFeaturesArray = function (array) {
  var arrayLength = Math.ceil(Math.random() * array.length);
  var featuresArray = [];
  for (var i = 0; i < arrayLength; i++) {
    featuresArray[i] = array[i];
  }
  return featuresArray;
};

/**
 * Создает массив случайным образом переставленных местами ссылок на фотографии
 * @param {Array.<string>} array - массив с исходным списком ссылок
 * @return {Array.<string>}
 */
var createPhotosArray = function (array) {
  var newFirstElementPosition = Math.floor(Math.random() * array.length);
  var FirstElement = array[0];
  array[0] = array[newFirstElementPosition];
  array[newFirstElementPosition] = FirstElement;

  return array;
};

/**
 * Создает массив объектов похожих объявлений
 * @param {number} arrayLength - количество записываемых в массив объявлений
 * @return {Array.<Object>}
 */
var generateSimilarAds = function (arrayLength) {
  var nearAds = [];

  for (var i = 0; i < arrayLength; i++) {
    nearAds[i] = {
      author: {},
      location: {},
      offer: {}
    };

    nearAds[i].author.avatar = AVATAR_URL + AVATAR_FIRST_NUMBER + (i + 1) + AVATAR_EXTENSION;
    nearAds[i].location.x = Math.round(Math.random() * (MAXIMUM_X_CORD - MINIMUM_X_CORD) + MINIMUM_X_CORD);
    nearAds[i].location.y = Math.round(Math.random() * (MAXIMUM_Y_CORD - MINIMUM_Y_CORD) + MINIMUM_Y_CORD);
    nearAds[i].offer.title = propertyTitlesList[i];
    nearAds[i].offer.address = String(nearAds[i].location.x) + ', ' + String(nearAds[i].location.y);
    nearAds[i].offer.price = Math.round(Math.random() * (MAXIMUM_PRICE - MINIMUM_PRICE) + MINIMUM_PRICE);
    nearAds[i].offer.type = createPropertyTypesArray(propertyTitlesList)[i];
    nearAds[i].offer.rooms = Math.ceil(Math.random() * MAXIMUM_ROOM_COUNT);
    nearAds[i].offer.guests = Math.ceil(Math.random() * MAXIMUM_GUEST_COUNT);
    nearAds[i].offer.checkin = checkinTimesList[Math.floor(Math.random() * checkinTimesList.length)];
    nearAds[i].offer.checkout = checkoutTimesList[Math.floor(Math.random() * checkoutTimesList.length)];
    nearAds[i].offer.features = createFeaturesArray(featuresList);
    nearAds[i].offer.description = ' ';
    nearAds[i].offer.photos = createPhotosArray(photosList);
  }

  return nearAds;
};


/**
 * Создает DOM-элементы, соответствующие меткам на карте
 * @param {Array.<Object>} array - массив объектов с исходными данными
 */
var createMapPinsFromArray = function (array) {
  var mapPins = document.querySelector('.map__pins');
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < array.length; i++) {
    var mapPin = mapPinTemplate.cloneNode(true);
    var mapPinImage = mapPin.querySelector('img');
    mapPin.style.left = (array[i].location.x - PIN_WIDTH / 2) + 'px';
    mapPin.style.top = (array[i].location.y - PIN_HEIGHT) + 'px';
    mapPinImage.src = array[i].author.avatar;
    mapPinImage.alt = array[i].offer.title;

    fragment.appendChild(mapPin);
  }

  mapPins.appendChild(fragment);
};


/**
 * Создает DOM-элементы (набор изображений) и добавляет их в родительский блок
 * @param {Object} element - объект, содержащий данные для создания DOM-элементов
 * @param {Object} photoBlock - родительский блок
 */
var addPhotoImage = function (element, photoBlock) {
  var mapCardPhoto = photoBlock.querySelector('.popup__photo');

  for (var i = 0; i < element.offer.photos.length; i++) {
    if (i > 0) {
      mapCardPhoto = mapCardPhoto.cloneNode(true);
    }

    mapCardPhoto.src = element.offer.photos[i];
    photoBlock.appendChild(mapCardPhoto);
  }
};

/**
 * Создает DOM-элемент объявления
 * @param {Object} element - объект, содержащий данные для создания DOM-элементов
 */
var createMapCard = function (element) {
  var map = document.querySelector('.map');
  var mapCard = document.querySelector('template').content.querySelector('.map__card').cloneNode(true);

  mapCard.querySelector('.popup__title').textContent = element.offer.title;
  mapCard.querySelector('.popup__text--address').textContent = element.offer.adress;
  mapCard.querySelector('.popup__text--price').textContent = element.offer.price + '₽/ночь';
  mapCard.querySelector('.popup__type').textContent = element.offer.type;
  mapCard.querySelector('.popup__text--capacity').textContent = element.offer.rooms + ' комнаты для ' + element.offer.guests + ' гостей';
  mapCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + element.offer.checkin + ', выезд до ' + element.offer.checkout;
  mapCard.querySelector('.popup__description').textContent = element.offer.description;

  addPhotoImage(element, mapCard.querySelector('.popup__photos'));

  mapCard.querySelector('.popup__avatar').textContent = element.author.avatar;

  map.insertBefore(mapCard, map.querySelector('.map__filters-container'));
};

var mapBlock = document.querySelector('.map');
mapBlock.classList.remove('map--faded');

var similarAds = generateSimilarAds(NUMBER_OF_ADS);

createMapPinsFromArray(similarAds);
createMapCard(similarAds[0]);
