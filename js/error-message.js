'use strict';

(function () {
  var MessageParam = {
    STYLE: 'z-index: 100; margin: 0 auto; text-align: center; background-color: red; transform: translateY: -50%',
    POSITION: 'fixed',
    TOP: '50%',
    LEFT: 0,
    RIGHT: 0,
    FONT_SIZE: '30px'
  };

  window.getErrorMessage = function (errorMessage) {
    var message = document.createElement('div');
    message.style = MessageParam.STYLE;
    message.style.position = MessageParam.POSITION;
    message.style.top = MessageParam.TOP;
    message.style.left = MessageParam.LEFT;
    message.style.right = MessageParam.RIGHT;
    message.style.fontSize = MessageParam.FONT_SIZE;
    message.textContent = errorMessage;
    var onEscPress = function (evt) {
      window.utils.callFunctionIfEscPress(evt.keyCode, function () {
        document.body.removeChild(message);
        document.removeEventListener('keydown', onEscPress);
      });
    };
    document.addEventListener('keydown', onEscPress);
    document.body.appendChild(message);
  };
})();
