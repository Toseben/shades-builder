var mobile = require('is-mobile');

AFRAME.registerComponent('selector-hover', {

  init: function () {
    var entity = this;
    this.camera = document.getElementById('camera');

    // PC ARROW INTERACTION
    this.el.addEventListener('mouseenter', function () {
      entity.el.emit('scale-up');
    });

    this.el.addEventListener('mouseleave', function () {
      entity.el.emit('scale-down');
    });

    if (!mobile()) {
      this.el.addEventListener('click', function () {
        entity.el.emit('scale-down');
        setTimeout(function() {
          entity.el.emit('scale-up');
        }, 250);
      });
    }

    // MOBILE ARROW INTERACTION
    if (mobile()) {
      this.el.addEventListener('click', function () {
        entity.el.emit('scale-up');
        setTimeout(function() {
          entity.el.emit('scale-down');
        }, 250);
      });
    };
  },

  tick: function() {
    var camRot = this.camera.getAttribute('rotation');
    this.el.setAttribute('rotation', { x: camRot.x });
  }
});

AFRAME.registerComponent('follow-camera', {

  init: function() {
    this.camera = document.getElementById('camera');
  },

  tick: function() {
    var camRot = this.camera.getAttribute('rotation');
    this.el.setAttribute('rotation', {y: camRot.y});
  }
});
