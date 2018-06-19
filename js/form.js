'use strict';
(function () {
  var noticeForm = document.querySelector('.ad-form');
  var noticeFormFieldsets = noticeForm.querySelectorAll('fieldset');
  var title = noticeForm.querySelector('#title');
  var adressField = noticeForm.querySelector('#address');
  var housingType = noticeForm.querySelector('#type');
  var price = noticeForm.querySelector('#price');
  var arrivalTime = noticeForm.querySelector('#timein');
  var departureTime = noticeForm.querySelector('#timeout');
  var roomNumber = noticeForm.querySelector('#room_number');
  var guestsNumber = noticeForm.querySelector('#capacity');
  var guestsNumberOptions = guestsNumber.querySelectorAll('option');
  var resetButton = noticeForm.querySelector('.ad-form__reset');
  var invalidFields = [];

  var housingPriceMatch = {
    'bungalo': {
      MIN_VALUE: '0',
      PLACEHOLDER: '0',
    },
    'flat': {
      MIN_VALUE: '1000',
      PLACEHOLDER: '1 000',
    },
    'house': {
      MIN_VALUE: '5000',
      PLACEHOLDER: '5 000',
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
    noticeForm.classList.add('ad-form--disabled');
    noticeFormFieldsets.forEach(function (item) {
      item.setAttribute('disabled', 'disabled');
    });
  };

  /**
   * Устанавливает доступные параметры поля Количество гостей
   */
  var setGuestNumber = function () {
    guestsNumberOptions.forEach(function (element) {
      element.disabled = !roomNumberMatch[roomNumber.value].includes(element.value);
    });

    guestsNumber.value = roomNumberMatch[roomNumber.value].includes(guestsNumber.value) ? guestsNumber.value : roomNumberMatch[roomNumber.value][0];
  };

  var onHousingTypeChange = setPriceAttributes;

  var onRoomNumberChange = setGuestNumber;

  var onElementChange = function (evt) {
    if (!evt.target.checkValidity()) {
      highlightField(evt.target);
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

  var onNoticeFormInvalid = function (evt) {
    highlightField(evt.target);
  };

  var onResetButtonClick = function (evt) {
    evt.preventDefault();
    window.page.deactivate();
  };

  var addListeners = function () {
    title.addEventListener('change', onElementChange);
    housingType.addEventListener('change', onHousingTypeChange);
    price.addEventListener('change', onElementChange);
    arrivalTime.addEventListener('change', onArrivalTimeChange);
    departureTime.addEventListener('change', onDepartureTimeChange);
    roomNumber.addEventListener('change', onRoomNumberChange);
    noticeForm.addEventListener('invalid', onNoticeFormInvalid, true);
    resetButton.addEventListener('click', onResetButtonClick);
  };

  var removeListeners = function () {
    title.removeEventListener('change', onElementChange);
    housingType.removeEventListener('change', onHousingTypeChange);
    price.removeEventListener('change', onElementChange);
    arrivalTime.removeEventListener('change', onArrivalTimeChange);
    departureTime.removeEventListener('change', onDepartureTimeChange);
    roomNumber.removeEventListener('change', onRoomNumberChange);
    noticeForm.removeEventListener('invalid', onNoticeFormInvalid, true);
    resetButton.removeEventListener('click', onResetButtonClick);
  };

  disableForm();

  window.form = {
    init: function () {
      noticeForm.classList.remove('ad-form--disabled');
      noticeFormFieldsets.forEach(function (item) {
        item.removeAttribute('disabled');
      });
      setGuestNumber();
      addListeners();
    },
    deactivate: function () {
      noticeForm.reset();
      disableForm();
      removeListeners();
      setPriceAttributes();
      invalidFields.forEach(function (item) {
        unhighlightField(item);
      });
      invalidFields = [];
    },
    setAdressValue: function (value) {
      adressField.value = value;
    },
  };
})();
