'use strict';
var title = window.noticeForm.querySelector('#title');
var housingType = window.noticeForm.querySelector('#type');
var price = window.noticeForm.querySelector('#price');
var arrivalTime = window.noticeForm.querySelector('#timein');
var departureTime = window.noticeForm.querySelector('#timeout');
var roomNumber = window.noticeForm.querySelector('#room_number');
var guestsNumber = window.noticeForm.querySelector('#capacity');
var resetButton = window.noticeForm.querySelector('.ad-form__reset');
var guestsNumberOptions = guestsNumber.querySelectorAll('option');
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
  invalidFields.splice(invalidFields.indexOf(element), 1);
};

var onElementChange = function (evt) {
  if (!evt.target.checkValidity()) {
    highlightField(evt.target);
  } else if (invalidFields.indexOf(evt.target) !== -1) {
    unhighlightField(evt.target);
  }
};

/**
 * Изменяет поле цены в соответствии с полем типа жилья
 */
var onHousingTypeChange = function () {
  price.min = housingPriceMatch[housingType.value].MIN_VALUE;
  price.placeholder = housingPriceMatch[housingType.value].PLACEHOLDER;
};

title.addEventListener('change', onElementChange);

housingType.addEventListener('change', onHousingTypeChange);

price.addEventListener('change', onElementChange);

/**
 * Приводит в соответствие значение полей
 * @param {Node} element - элемент, значение которого меняем
 * @param {string} value - новое значение
 */
var matchTime = function (element, value) {
  element.value = value;
};

arrivalTime.addEventListener('change', function (evt) {
  matchTime(departureTime, evt.target.value);
});

departureTime.addEventListener('change', function (evt) {
  matchTime(arrivalTime, evt.target.value);
});

var roomNumberMatch = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};

window.onRoomNumberChange = function () {

  guestsNumberOptions.forEach(function (element) {
    element.disabled = !roomNumberMatch[roomNumber.value].includes(element.value);
  });

  guestsNumber.value = roomNumberMatch[roomNumber.value].includes(guestsNumber.value) ? guestsNumber.value : roomNumberMatch[roomNumber.value][0];
};

roomNumber.addEventListener('change', window.onRoomNumberChange);

/**
 * Деактивирует страницу
 */
var deactivatePage = function () {
  deactivateMap();
  deactivateForm();
  window.activatedPage = false;
};

resetButton.addEventListener('click', function (evt) {
  evt.preventDefault();
  deactivatePage();
});

window.noticeForm.addEventListener('invalid', function (evt) {
  highlightField(evt.target);
}, true);

/**
 * Деактивирует форму
*/
var deactivateForm = function () {
  window.noticeForm.reset();
  window.disableForm();
  onHousingTypeChange();
  window.setAdressValue(false);
  for (var i = invalidFields.length; i > 0; i--) {
    unhighlightField(invalidFields[0]);
  }
};

/**
 * Деактивирует карту
 */
var deactivateMap = function () {
  window.mapPins.forEach(function (item) {
    window.mapPinsContainer.removeChild(item);
  });
  window.mapPins = [];
  window.deleteDisplayedAD();
  window.map.classList.add('map--faded');
  window.mainPin.style.left = window.pinInactiveCordX + 'px';
  window.mainPin.style.top = window.pinInactiveCordY + 'px';
};
