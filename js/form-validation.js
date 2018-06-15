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
 * Проверяет валидность элемента
 * @param {Node} element - Проверяемый элемент
 */
var verifyValidity = function (element) {
  var valid;
  if (!element.checkValidity()) {
    element.classList.add('invalid-field');
    valid = false;
  } else if (!valid) {
    element.classList.remove('invalid-field');
    valid = true;
  }
};

/**
 * Изменяет поле цены в соответствии с полем типа жилья
 */
var onHousingTypeChange = function () {
  price.min = housingPriceMatch[housingType.value].MIN_VALUE;
  price.placeholder = housingPriceMatch[housingType.value].PLACEHOLDER;
  verifyValidity(price);
};

title.addEventListener('change', function () {
  verifyValidity(title);
});

housingType.addEventListener('change', onHousingTypeChange);

price.addEventListener('change', function () {
  verifyValidity(price);
});

var matchTime = function (element, newMean) {
  element.value = newMean;
};

arrivalTime.addEventListener('change', function (evt) {
  matchTime(departureTime, evt.target.value);
});

departureTime.addEventListener('change', function (evt) {
  matchTime(arrivalTime, evt.target.value);
});

/**
 * Устанавливает соответствие количества комнат количеству гостей
 * @param {string} value - количество комнат
 */
var setGuestNumberValidity = function (value) {
  guestsNumberOptions.forEach(function (item) {
    var roomNumberMatch = {
      '1': item.value !== '1',
      '2': (item.value !== '1') && (item.value !== '2'),
      '3': item.value === '0',
      '100': item.value !== '0'
    };
    if (roomNumberMatch[value]) {
      item.setAttribute('disabled', 'disabled');
      item.removeAttribute('selected');
    } else {
      item.setAttribute('selected', 'selected');
      item.removeAttribute('disabled');
    }
  });
};

roomNumber.addEventListener('change', function () {
  setGuestNumberValidity(roomNumber.value);
});

/**
 * Деактивирует страницу
 */
var deactivatePage = function () {
  deactivateForm();
  deactivateMap();
  window.activatedPage = false;
};

resetButton.addEventListener('click', function (evt) {
  evt.preventDefault();
  deactivatePage();
}
);

window.noticeForm.addEventListener('invalid', function (evt) {
  evt.target.classList.add('invalid-field');
}, true
);

/**
 * Деактивирует форму
*/
var deactivateForm = function () {
  window.noticeForm.reset();
  window.disableForm();
  onHousingTypeChange();
  var mainPinCordY = window.mainPin.offsetTop - window.mainPinParams.HEIGHT / 2;
  window.setAdressValue(window.mainPinCordX, mainPinCordY);
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
};
