'use strict';

(function () {
  var ARRAY_LENGTH = 5;
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
      MAX: 10000
    },
    'high': {
      MIN: 50000,
      MAX: Infinity
    }
  };

  var debounce = function (cb) {
    setTimeout(cb, 500);
  };

  /**
   * Переключает доступность фильтров
   * @param {Array.<Node>} array - массив фильтров
   * @param {boolean} value - значение активности/неактивности
   */
  var toggleFilterAccessibility = function (array, value) {
    array.forEach(function (item) {
      item.disabled = value;
    });
  };

  /**
   * Деактивирует фильтры
   */
  var deactivateFilters = function () {
    toggleFilterAccessibility(selects, true);
    toggleFilterAccessibility(features, true);
  };

  /**
   * Фильтрует объявления
   * @param {Array.<Object>} array - массив объявлений
   */
  var filterAds = function (array) {
    newArray = array;
    var featuresChecked = Array.from(features).filter(function (item) {
      return item.checked;
    });

    featuresChecked.forEach(function (item) {
      newArray = newArray.filter(function (element) {
        return element.offer.features.includes(item.value);
      });
    });

    newArray = newArray.filter(function (item) {
      var typeFilter = (type.value === 'any') ? item : item.offer.type === type.value;
      var priceFilter = (price.value === 'any') ? item : (item.offer.price >= priceMatch[price.value].MIN) && (item.offer.price <= priceMatch[price.value].MAX);
      var roomsFilter = (rooms.value === 'any') ? item : item.offer.rooms === Number(rooms.value);
      var guestsFilter = (guests.value === 'any') ? item : item.offer.guests === Number(guests.value);

      return typeFilter && priceFilter && roomsFilter && guestsFilter;
    });
  };

  /**
   * Применяет фильтры на странице, отрисовывает пины
   */
  var applyFilters = function () {
    window.popup.close();
    window.pins.remove();
    window.pins.create(newArray.slice(0, ARRAY_LENGTH));
  };

  var onSelectsChange = function () {
    filterAds(data);
    debounce(applyFilters());
  };

  var onFeaturesClick = function () {
    filterAds(data);
  };

  var adListeners = function () {
    selects.forEach(function (item) {
      item.addEventListener('change', onSelectsChange);
    });
    features.forEach(function (item) {
      item.addEventListener('click', onFeaturesClick);
    });
  };

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
      data = array;
      toggleFilterAccessibility(selects, false);
      toggleFilterAccessibility(features, false);
      adListeners();
      return array.slice(0, ARRAY_LENGTH);
    },

    deactivate: function () {
      deactivateFilters();
      removeListeners();
      filter.reset();
    }
  };
})();
