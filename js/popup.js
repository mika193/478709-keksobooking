'use strict';

(function () {
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters-container');
  var activeCard;

  var offerTypesTranslation = {
    'flat': 'Квартира',
    'palace': 'Дворец',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  var PhotoParam = {
    WIDTH: 45,
    HEIGHT: 40,
    ALT: 'Фотография жилья',
    CLASS: 'popup__photo'
  };

  /**
   * Генерирует элемент списка характеристик
   * @param {string} feature - текст, прибавляемый к классу элемента
   * @return {Node}
   */
  var createFeature = function (feature) {
    var mapNewFeature = document.createElement('li');
    mapNewFeature.classList.add('popup__feature');
    mapNewFeature.classList.add('popup__feature--' + feature);
    return mapNewFeature;
  };

  /**
   * Создает DOM-элемент (изображение)
   * @param {string} link - адрес картинки
   * @return {Node}
   */
  var getPhoto = function (link) {
    var element = document.createElement('img');
    element.src = link;
    element.style.width = PhotoParam.WIDTH + 'px';
    element.style.height = PhotoParam.HEIGHT + 'px';
    element.alt = PhotoParam.ALT;
    element.classList.add(PhotoParam.CLASS);
    return element;
  };

  /**
   * Закрывает попап с объявлением
   */
  var closePopup = function () {
    if (activeCard) {
      activeCard.remove();
      document.removeEventListener('keydown', onPopupEscPress);
      activeCard = null;
      window.pin.deactivate();
    }
  };

  var onPopupEscPress = function (evt) {
    window.utils.callFunctionIfEscPress(evt.keyCode, closePopup);
  };

  /**
   * Создает DOM-элемент объявления
   * @param {Ad} dataObject - объект, содержащий данные для создания DOM-элементов
   * @return {Node}
   */
  var createCard = function (dataObject) {
    var card = mapCardTemplate.cloneNode(true);
    var featuresBlock = card.querySelector('.popup__features');
    var photoBlock = card.querySelector('.popup__photos');
    card.querySelector('.popup__avatar').src = dataObject.author.avatar;
    card.querySelector('.popup__title').textContent = dataObject.offer.title;
    card.querySelector('.popup__text--address').textContent = dataObject.offer.adress;
    card.querySelector('.popup__text--price').textContent = dataObject.offer.price + '₽/ночь';
    card.querySelector('.popup__type').textContent = offerTypesTranslation[dataObject.offer.type];
    card.querySelector('.popup__text--capacity').textContent = dataObject.offer.rooms +
      ' ' + window.utils.getDeclension(dataObject.offer.rooms, ['комната', 'комнаты', 'комнат']) +
      ' для ' + dataObject.offer.guests + ' ' +
      window.utils.getDeclension(dataObject.offer.guests, ['гостя', 'гостей', 'гостей']);
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + dataObject.offer.checkin +
      ', выезд до ' + dataObject.offer.checkout;
    card.querySelector('.popup__description').textContent = dataObject.offer.description;

    dataObject.offer.features.forEach(function (item) {
      featuresBlock.appendChild(createFeature(item));
    });

    dataObject.offer.photos.forEach(function (item) {
      photoBlock.appendChild(getPhoto(item));
    });
    card.querySelector('.popup__close').addEventListener('click', function () {
      closePopup();
    });
    document.addEventListener('keydown', onPopupEscPress);

    card.querySelector('.popup__avatar').textContent = dataObject.author.avatar;
    return card;
  };

  window.popup = {
    /**
   * Открывает попап с объявлением, соответствующим нажатой метке
   * @param {Ad} dataObject - объект с исходными данными
   */
    open: function (dataObject) {
      closePopup();
      var card = createCard(dataObject);
      activeCard = card;
      map.insertBefore(card, mapFilters);
    },

    close: closePopup
  };
})();
