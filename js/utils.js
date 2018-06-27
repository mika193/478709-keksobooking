'use strict';

(function () {
  /** @constant {number} */
  var ESC_CODE = 27;
  var debounceTimeout;

  window.utils = {
    /**
   * Возвращает слово с правильным окончанием
   * @param {number} number - число в соответствии с которым изменяется слово
   * @param {Array.<string>} array - массив вариантов написания слова в порядке: единственное число, множественное для number от 2 до 4 включительно, множественное для number от 5 включительно
   * @return {string}
   */
    getDeclension: function (number, array) {
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
    },

    callFunctionIfEscPress: function (keyCode, cb) {
      if (keyCode === ESC_CODE) {
        cb();
      }
    },

    debounce: function (cb, timeout) {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(cb, timeout);
    }
  };
})();
