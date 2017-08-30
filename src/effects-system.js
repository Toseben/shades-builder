const AFRAME = require('aframe');

/**
 * Configures a THREE.EffectComposer on the current A-Frame scene.
 */
module.exports = AFRAME.registerSystem('effects', {
  /**
   * Configure composer with a few arbitrary passes.
   */
  init: function () {
    const sceneEl = this.sceneEl;

    if (!sceneEl.hasLoaded) {
      sceneEl.addEventListener('render-target-loaded', this.init.bind(this));
      return;
    }

    const scene = sceneEl.object3D;
    const renderer = sceneEl.renderer;
    const camera = sceneEl.camera;

    const composer = new THREE.EffectComposer(renderer);
    const pass1 = new THREE.RenderPass(scene, camera);

    // LUT
    var lut = new THREE.ShaderPass(THREE.LUTShader);
    this.lut = lut;
    const tLookup = new THREE.TextureLoader().load( "./lookup/lookup_miss_etikate.png" );
    tLookup.generateMipmaps = false;
    tLookup.minFilter = THREE.LinearFilter;
    lut.uniforms.tLookup.value = tLookup;

    const pass3 = new THREE.ShaderPass(THREE.CopyShader);

    pass3.renderToScreen = true;

    composer.addPass(pass1);
    composer.addPass(lut);
    composer.addPass(pass3);

    this.composer = composer;
    this.t = 0;
    this.dt = 0;

    this.bind();

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('load', onWindowResize, false);

    function onWindowResize() {
      var w = window.innerWidth;
      var h = window.innerHeight;
      var size = w > h ? w : h;
      renderer.setSize(w, h);
      composer.setSize(w, h);

      lut.uniforms.resolution.value.x = w;
      lut.uniforms.resolution.value.y = h;
    };

  },

  /**
   * Record the timestamp for the current frame.
   * @param {number} t
   * @param {number} dt
   */
  tick: function (t, dt) {
    this.t = t;
    this.dt = dt;

    if (this.lut) {
      this.lut.uniforms.t.value = t;
    };
  },

  /**
   * Binds the EffectComposer to the A-Frame render loop.
   * (This is the hacky bit.)
   */
  bind: function () {
    const renderer = this.sceneEl.renderer;
    const render = renderer.render;
    const system = this;
    let isDigest = false;

    renderer.render = function () {
      if (isDigest) {
        render.apply(this, arguments);
      } else {
        isDigest = true;
        system.composer.render(system.dt);
        isDigest = false;
      }
    };
  }
});
