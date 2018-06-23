'use strict';

(function () {
  var messageParams = {
    STYLE: 'z-index: 100; margin: 0 auto; text-align: center; background-color: red; transform: translateY: -50%',
    POSITION: 'fixed',
    TOP: '50%',
    LEFT: 0,
    RIGHT: 0,
    FONT_SIZE: '30px'
  };

  window.getErrorMessage = function (errorMessage) {
    var message = document.createElement('div');
    message.style = messageParams.STYLE;
    message.style.position = messageParams.POSITION;
    message.style.top = messageParams.TOP;
    message.style.left = messageParams.LEFT;
    message.style.right = messageParams.RIGHT;
    message.style.fontSize = messageParams.FONT_SIZE;
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
