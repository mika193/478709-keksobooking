'use strict';

(function () {
  /** @constant {string} */
  var AVATAR_EXT = 'img/muffin-grey.svg';

  var form = document.querySelector('.ad-form');
  var formFieldsets = form.querySelectorAll('fieldset');
  var title = form.querySelector('#title');
  var adressField = form.querySelector('#address');
  var housingType = form.querySelector('#type');
  var price = form.querySelector('#price');
  var arrivalTime = form.querySelector('#timein');
  var departureTime = form.querySelector('#timeout');
  var roomNumber = form.querySelector('#room_number');
  var guestsNumber = form.querySelector('#capacity');
  var guestsNumberOptions = guestsNumber.querySelectorAll('option');
  var reset = form.querySelector('.ad-form__reset');
  var success = document.querySelector('.success');
  var avatarBox = document.querySelector('#avatar-box');
  var photoBox = document.querySelector('.ad-form__photo');
  var avatar = document.querySelector('.ad-form-header__input');
  var photo = document.querySelector('.ad-form__input');
  var photoContainer = document.querySelector('.ad-form__photo-container');
  var invalidFields = [];
  var images = [];

  var PhotoParam = {
    WIDTH: '70px',
    HEIGHT: '70px'
  };

  var housingPriceMatch = {
    'bungalo': {
      MIN_VALUE: '0',
      PLACEHOLDER: '0'
    },
    'flat': {
      MIN_VALUE: '1000',
      PLACEHOLDER: '1 000'
    },
    'house': {
      MIN_VALUE: '5000',
      PLACEHOLDER: '5 000'
    },
    'palace': {
      MIN_VALUE: '10000',
      PLACEHOLDER: '10 000'
    }
  };

  var roomNumberMatch = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  /**
   * Обводит рамкой невалидное поле
   * @param {Node} element - невалидное поле
   */
  var highlightField = function (element) {
    element.classList.add('invalid-field');
    invalidFields.push(element);
  };

  /**
   * Снимает рамку с валидного поля
   * @param {Node} element - валидное поле
   */
  var unhighlightField = function (element) {
    element.classList.remove('invalid-field');
  };

  /**
   * Изменяет поле цены в соответствии с полем типа жилья
   */
  var setPriceAttributes = function () {
    price.min = housingPriceMatch[housingType.value].MIN_VALUE;
    price.placeholder = housingPriceMatch[housingType.value].PLACEHOLDER;
  };

  /**
   * Приводит в соответствие значение полей
   * @param {Node} element - элемент, значение которого меняем
   * @param {string} value - новое значение
   */
  var matchTime = function (element, value) {
    element.value = value;
  };

  /**
   * Делает поля формы недоступными
   */
  var disableForm = function () {
    form.classList.add('ad-form--disabled');
    formFieldsets.forEach(function (item) {
      item.disabled = true;
    });
  };

  /**
   * Устанавливает доступные параметры поля Количество гостей
   */
  var setGuestNumber = function () {
    guestsNumberOptions.forEach(function (element) {
      element.disabled = !roomNumberMatch[roomNumber.value].includes(element.value);
    });

    guestsNumber.value = roomNumberMatch[roomNumber.value].includes(guestsNumber.value) ?
      guestsNumber.value : roomNumberMatch[roomNumber.value][0];
  };

  /**
   * Закрывает попап с сообщением об отправке формы;
   */
  var closePopup = function () {
    success.classList.add('hidden');
    document.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onPopupEscPress);
  };

  /**
   * Отрисовывает аватар
   * @param {string} value - значение, которое будет записано в src
   */
  var displayAvatar = function (value) {
    avatarBox.src = value;
  };

  /**
   * Отрисовывает фото
   * @param {string} value - значение, которое будет записано в src
   */
  var displayPhoto = function (value) {
    var imageContainer = photoBox.cloneNode();
    var image = document.createElement('img');
    image.src = value;
    image.style.width = PhotoParam.WIDTH;
    image.style.height = PhotoParam.HEIGHT;
    images.push(image);
    imageContainer.appendChild(image);
    photoContainer.insertBefore(imageContainer, photoBox);
  };

  /**
   * Удаляет изображения, добавленные на страницу пользователем
   */
  var deleteImages = function () {
    images.forEach(function (item) {
      item.remove();
    });
    images = [];
    avatarBox.src = AVATAR_EXT;
  };

  /**
   * Отрисовывает изображения
   * @param {Array} files - массив загруженных файлов
   * @param {function} cb - функция - обрабатывающая загруженные файлы
   */
  var displayImage = function (files, cb) {
    var reader = new FileReader();
    Array.from(files).forEach(function (item) {
      if (item.type.includes('image/')) {
        reader.readAsDataURL(item);
        reader.addEventListener('load', function () {
          cb(reader.result);
        });
      }
    });
  };

  var onAvatarChange = function (evt) {
    displayImage(evt.target.files, displayAvatar);
  };

  var onPhotoChange = function (evt) {
    displayImage(evt.target.files, displayPhoto);
  };

  var onHousingTypeChange = setPriceAttributes;

  var onRoomNumberChange = setGuestNumber;

  var onElementInput = function (evt) {
    if (evt.target.checkValidity()) {
      unhighlightField(evt.target);
      evt.target.removeEventListener('input', onElementInput);
    }
  };

  var onElementChange = function (evt) {
    if (!evt.target.checkValidity()) {
      highlightField(evt.target);
      evt.target.addEventListener('input', onElementInput);
    } else if (invalidFields.indexOf(evt.target) !== -1) {
      unhighlightField(evt.target);
      invalidFields.splice(invalidFields.indexOf(evt.target), 1);
    }
  };

  var onArrivalTimeChange = function (evt) {
    matchTime(departureTime, evt.target.value);
  };

  var onDepartureTimeChange = function (evt) {
    matchTime(arrivalTime, evt.target.value);
  };

  var onFormInvalid = function (evt) {
    highlightField(evt.target);
  };

  var onResetClick = function (evt) {
    evt.preventDefault();
    window.page.deactivate();
  };

  var onClick = closePopup;

  var onPopupEscPress = function (evt) {
    window.utils.callFunctionIfEscPress(evt.keyCode, closePopup);
  };

  var onLoadSuccess = function () {
    window.page.deactivate();
    success.classList.remove('hidden');
    document.activeElement.blur();
    document.addEventListener('keydown', onPopupEscPress);
    document.addEventListener('click', onClick);
  };

  var onLoadError = function (errorMessage) {
    window.getErrorMessage(errorMessage);
  };

  var onFormSubmit = function (evt) {
    window.backend.upload(new FormData(form), onLoadSuccess, onLoadError);
    evt.preventDefault();
  };

  /**
   * Добавляет обработчики событий на форму и ее элементы
   */
  var addListeners = function () {
    title.addEventListener('change', onElementChange);
    housingType.addEventListener('change', onHousingTypeChange);
    price.addEventListener('change', onElementChange);
    arrivalTime.addEventListener('change', onArrivalTimeChange);
    departureTime.addEventListener('change', onDepartureTimeChange);
    roomNumber.addEventListener('change', onRoomNumberChange);
    form.addEventListener('invalid', onFormInvalid, true);
    reset.addEventListener('click', onResetClick);
    form.addEventListener('submit', onFormSubmit);
    avatar.addEventListener('change', onAvatarChange);
    photo.addEventListener('change', onPhotoChange);
  };

  /**
   * Удаляет обработчики событий с формы и ее элементов
   */
  var removeListeners = function () {
    title.removeEventListener('change', onElementChange);
    housingType.removeEventListener('change', onHousingTypeChange);
    price.removeEventListener('change', onElementChange);
    arrivalTime.removeEventListener('change', onArrivalTimeChange);
    departureTime.removeEventListener('change', onDepartureTimeChange);
    roomNumber.removeEventListener('change', onRoomNumberChange);
    form.removeEventListener('invalid', onFormInvalid, true);
    reset.removeEventListener('click', onResetClick);
    form.removeEventListener('submit', onFormSubmit);
    avatar.removeEventListener('change', onAvatarChange);
    photo.removeEventListener('change', onPhotoChange);
  };

  disableForm();

  window.form = {
    init: function () {
      form.classList.remove('ad-form--disabled');
      formFieldsets.forEach(function (item) {
        item.disabled = false;
      });
      setGuestNumber();
      addListeners();
    },
    deactivate: function () {
      form.reset();
      disableForm();
      removeListeners();
      setPriceAttributes();
      invalidFields.forEach(function (item) {
        unhighlightField(item);
      });
      invalidFields = [];
      deleteImages();
    },
    setAdressValue: function (value) {
      adressField.value = value;
    },
  };
})();
