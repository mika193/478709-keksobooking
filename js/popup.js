'use strict';

(function () {
  /** @constant {number} */
  var ESC_CODE = 27;

  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters-container');
  var activeCard;

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

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_CODE) {
      window.popup.close();
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
    mapCard.querySelector('.popup__text--capacity').textContent = dataObject.offer.rooms + ' ' + window.utils.getDeclension(dataObject.offer.rooms, ['комната', 'комнаты', 'комнат']) + ' для ' + dataObject.offer.guests + ' ' + window.utils.getDeclension(dataObject.offer.guests, ['гостя', 'гостей', 'гостей']);
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

  window.popup = {
    /**
   * Открывает попап с объявлением, соответствующим нажатой метке
   * @param {Ad} dataObject - объект с исходными данными
   */
    open: function (dataObject) {
      window.popup.close();
      var card = createMapCard(dataObject);
      card.querySelector('.popup__close').addEventListener('click', function () {
        window.popup.close();
      });
      document.addEventListener('keydown', onPopupEscPress);
      activeCard = card;
      map.insertBefore(card, mapFilters);
    },

    /**
     * Закрывает попап с объявлением
     */
    close: function () {
      if (activeCard) {
        map.removeChild(activeCard);
        document.removeEventListener('keydown', onPopupEscPress);
        activeCard = null;
        window.pin.classRemove();
      }
    }
  };
})();
