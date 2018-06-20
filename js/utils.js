'use strict';

(function () {
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

    /**
    * Генерирует случайное число в заданном диапазоне
    * @param {number} min - минимальное значение генерируемого числа
    * @param {number} max - максимальное значение генерируемого числа
    * @return {number}
    */
    getRandomNumber: function (min, max) {
      return Math.random() * (max - min) + min;
    },

    /**
   * Создает массив случайно расположенных элементов
   * @param {Array.<string>} array - массив с исходным списком строк
   * @param {number} length - необходимая длина массива
   * @param {boolean} unique - определяет будут ли повторяться элементы в новом массиве
   * @return {Array.<string>}
   */
    createRandomArray: function (array, length, unique) {
      var newArray = [];
      var i = 0;
      while (i < length) {
        var elementIndex = Math.floor(window.utils.getRandomNumber(0, array.length));
        if ((newArray.indexOf(array[elementIndex]) !== -1) && (unique)) {
          continue;
        }

        i++;
        newArray.push(array[elementIndex]);
      }

      return newArray;
    }
  };
})();
