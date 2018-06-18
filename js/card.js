'use strict';

(function () {
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

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
  window.createMapCard = function (dataObject) {
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
})();
