'use strict';
(function () {
  var activatedPage = false;

  window.page = {
    init: function () {
      if (!activatedPage) {
        window.map.init();
        window.form.init();
        activatedPage = true;
      }
    },
    deactivate: function () {
      window.form.deactivate();
      window.map.deactivate();
      activatedPage = false;
    }
  };
})();

