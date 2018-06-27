'use strict';

(function () {
  /** @constant {number} */
  var NUMBER_OF_PINS = 5;

  /** @constant {number} */
  var TIMEOUT = 500;

  var filter = document.querySelector('.map__filters');
  var type = filter.querySelector('#housing-type');
  var price = filter.querySelector('#housing-price');
  var rooms = filter.querySelector('#housing-rooms');
  var guests = filter.querySelector('#housing-guests');
  var features = filter.querySelectorAll('#housing-features input');
  var selects = [type, price, rooms, guests];
  var newArray;
  var data;

  var priceMatch = {
    'any': 'any',
    'middle': {
      MIN: 10000,
      MAX: 50000
    },
    'low': {
      MIN: 0,
      MAX: 9999
    },
    'high': {
      MIN: 50001,
      MAX: Infinity
    }
  };

  /**
   * Переключает доступность фильтров
   * @param {Array.<Node>} array - массив фильтров
   * @param {boolean} value - значение активности/неактивности
   */
  var toggleFilterAvailability = function (array, value) {
    array.forEach(function (item) {
      item.disabled = value;
    });
  };

  /**
   * Деактивирует фильтры
   */
  var deactivateFilters = function () {
    toggleFilterAvailability(selects, true);
    toggleFilterAvailability(features, true);
  };

  /**
   * Фильтрует объявления по переданному параметру
   * @param {Node} element - элемент на основании значения которого происходит фильтрация
   * @param {string} key - ключ для фильтрации
   * @param {string|number|Object} value - значение, по которому происходит фильтрация
   */
  var filterAdsByParam = function (element, key, value) {
    if (element.value !== 'any') {
      newArray = newArray.filter(function (item) {
        var filterValue = item.offer[key] === value;

        if (key === 'price') {
          filterValue = item.offer[key] >= value.min && item.offer[key] <= value.max;
        }

        return filterValue;
      });
    }
  };

  /**
   * Фильтрует объявления по всем параметрам
   * @param {Array.<Object>} array - массив объявлений
   */
  var filterAds = function () {
    newArray = data.slice(0);

    var featuresChecked = Array.from(features).filter(function (item) {
      return item.checked;
    });

    featuresChecked.forEach(function (item) {
      newArray = newArray.filter(function (element) {
        return element.offer.features.includes(item.value);
      });
    });

    filterAdsByParam(type, 'type', type.value);

    filterAdsByParam(price, 'price', {min: priceMatch[price.value].MIN, max: priceMatch[price.value].MAX});

    filterAdsByParam(rooms, 'rooms', parseInt(rooms.value, 10));

    filterAdsByParam(guests, 'guests', parseInt(guests.value, 10));
  };

  /**
   * Применяет фильтры на странице, отрисовывает пины
   */
  var applyFilters = function () {
    filterAds();
    window.popup.close();
    window.pins.remove();
    window.pins.create(newArray.slice(0, NUMBER_OF_PINS));
  };

  var onSelectsChange = function () {
    window.utils.debounce(applyFilters, TIMEOUT);
  };

  var onFeaturesClick = function () {
    window.utils.debounce(applyFilters, TIMEOUT);
  };

  /**
   * Добавляет обработчики событий на фильтры
   */
  var adListeners = function () {
    selects.forEach(function (item) {
      item.addEventListener('change', onSelectsChange);
    });
    features.forEach(function (item) {
      item.addEventListener('click', onFeaturesClick);
    });
  };

  /**
   * Удаляет обработчики событий с фильтров
   */
  var removeListeners = function () {
    selects.forEach(function (item) {
      item.removeEventListener('change', onSelectsChange);
    });
    features.forEach(function (item) {
      item.removeEventListener('click', onFeaturesClick);
    });
  };

  deactivateFilters();

  window.filter = {
    apply: function (array) {
      data = array.slice(0);
      toggleFilterAvailability(selects, false);
      toggleFilterAvailability(features, false);
      adListeners();
      return array.slice(0, NUMBER_OF_PINS);
    },

    deactivate: function () {
      deactivateFilters();
      removeListeners();
      filter.reset();
    }
  };
})();
