'use strict';

(function () {
  /** @constant {number} */
  var MAXIMUM_ROOM_COUNT = 5;

  /** @constant {number} */
  var MAXIMUM_GUEST_COUNT = 100;

  var avatarParams = {
    URL: 'img/avatars/user',
    EXTENSION: '.png'
  };

  var xCordParams = {
    MINIMUM: 300,
    MAXIMUM: 900
  };

  var yCordParams = {
    MINIMUM: 130,
    MAXIMUM: 630
  };

  var priceParams = {
    MINIMUM: 1000000,
    MAXIMUM: 1000
  };

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
  window.getData = function (index) {
    var locationX = Math.round(window.utils.getRandomNumber(xCordParams.MINIMUM, xCordParams.MAXIMUM));
    var locationY = Math.round(window.utils.getRandomNumber(yCordParams.MINIMUM, yCordParams.MAXIMUM));

    return {
      author: {
        avatar: generateAvatarPath(index + 1)
      },

      offer: {
        title: offerParams.PROPERTY_TITLES[index],
        address: locationX + ', ' + locationY,
        price: Math.round(window.utils.getRandomNumber(priceParams.MINIMUM, priceParams.MAXIMUM)),
        type: createPropertyType(offerParams.PROPERTY_TITLES[index]),
        rooms: Math.ceil(window.utils.getRandomNumber(1, MAXIMUM_ROOM_COUNT)),
        guests: Math.ceil(window.utils.getRandomNumber(1, MAXIMUM_GUEST_COUNT)),
        checkin: offerParams.TIMES[Math.floor(window.utils.getRandomNumber(0, offerParams.TIMES.length))],
        checkout: offerParams.TIMES[Math.floor(window.utils.getRandomNumber(0, offerParams.TIMES.length))],
        features: window.utils.createRandomArray(offerParams.FEATURES, Math.ceil(window.utils.getRandomNumber(1, offerParams.FEATURES.length)), true),
        description: '',
        photos: window.utils.createRandomArray(offerParams.PHOTOS, offerParams.PHOTOS.length, true)
      },

      location: {
        x: locationX,
        y: locationY
      }
    };
  };
})();
