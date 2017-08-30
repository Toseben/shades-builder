// LOAD SHADERS
const env_vert = require('raw-loader!../shaders/env.vert');
const env_frag = require('raw-loader!../shaders/env.frag');
const arrow_vert = require('raw-loader!../shaders/arrow.vert');
const arrow_frag = require('raw-loader!../shaders/arrow.frag');

let manager = window.manager = new THREE.LoadingManager();
let textureLoader = new THREE.TextureLoader(manager);

AFRAME.registerComponent('dwarf-material', {

  init: function() {
    let mtlComponent = this.el.components['material'];
		let textureCube = new THREE.CubeTextureLoader()
			.setPath( './img/env/04/' )
			.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );

    let bumpTexture = textureLoader.load( "./img/specular.jpg" );

    let material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      bumpMap: bumpTexture,
      bumpScale: 0.01,
			metalness: 0.15,
			roughness: 0.9,
			clearCoat:  0.1,
			clearCoatRoughness: 0.4,
			reflectivity: 0.4,
      envMap: textureCube,
      side: THREE.DoubleSide
    });

    mtlComponent.material = material;
  }
});

AFRAME.registerComponent('env-material', {

  init: function() {
    let mtlComponent = this.el.components['material'];
    let texture = textureLoader.load( "./img/paper.jpg" );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    this.material = new THREE.ShaderMaterial({
        uniforms: {
          elapsedTime: { type: 'f', value: 0 },
          texture: { type: 't', value: texture }
        },
        vertexShader: env_vert,
        fragmentShader: env_frag,
        side: THREE.BackSide
    });

    mtlComponent.material = this.material;
  },

  tick: function(time) {
    this.material.uniforms.elapsedTime.value = time * 0.0001;
  }
});

AFRAME.registerComponent('shadow-material', {

  init: function() {
    let mtlComponent = this.el.components['material'];
    let shadowTexture = textureLoader.load( "./img/shadowMap.jpg" );

    let material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      alphaMap: shadowTexture,
      opacity: 0.6,
      transparent: true,
      side: THREE.DoubleSide
    });

    mtlComponent.material = material;
  }
});

AFRAME.registerComponent('arrow-material', {

  schema: {
    invert: {type: 'boolean'}
  },

  init: function() {
    let mesh = this.el.getObject3D('mesh');
    let texture = textureLoader.load( "./img/arrow.jpg" );

    let material = new THREE.ShaderMaterial({
        uniforms: {
          texture: { type: 't', value: texture },
          invert: { type: 'i', value: this.data.invert ? -1 : 1 },
        },
        vertexShader: arrow_vert,
        fragmentShader: arrow_frag,
        side: THREE.DoubleSide,
        transparent: true
    });

    mesh.material = material;
  }
});

AFRAME.registerComponent('shades-material', {
  schema: {
    mtlIdx: {type: 'int'}
  },

  init: function() {
    this.mtlComponent = this.el.components['material'];
    let textureCube = new THREE.CubeTextureLoader()
      .setPath( './img/env/04/' )
      .load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );

    let bumpTexture = this.bumpTexture = textureLoader.load( "./img/shades_bump.jpg" );
    bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping;
    bumpTexture.repeat.set( 4, 4 );

    let woodTexture = this.woodTexture = textureLoader.load( "./img/wood.jpg" );
    woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
    woodTexture.repeat.set( 1.5, 1.5 );

    let material = this.material = new THREE.MeshPhysicalMaterial({
			clearCoat:  0.0,
			clearCoatRoughness: 0.0,
			reflectivity: 1.0,
      envMap: textureCube,
      side: THREE.FrontSide
    });
  },

  update: function() {
    let material = this.material;

    switch (this.data.mtlIdx) {
      case 0:
        material.map = null;
        material.bumpMap = this.bumpTexture;
        material.bumpScale = 0.001;
        material.color.setHex( 0xF2D2CB );
        material.metalness = 0.35;
        material.roughness = 0.6;
        material.needsUpdate = true;
        break;
      case 1:
        material.map = this.woodTexture;
        material.bumpMap = this.woodTexture;
        material.bumpScale = 0.002;
        material.color.setHex( 0x665D5D );
        material.metalness = 0.0;
        material.roughness = 0.5;
        material.needsUpdate = true;
        break;
      case 2:
        material.map = null;
        material.bumpMap = null;
        material.bumpScale = 0.0;
        material.color.setHex( 0x555555 );
        material.metalness = 1.0;
        material.roughness = 0.4;
        material.needsUpdate = true;
        break;
      case 3:
        material.map = null;
        material.bumpMap = null;
        material.bumpScale = 0.0;
        material.color.setHex( 0xDDDDDD );
        material.metalness = 0.75;
        material.roughness = 0.25;
        material.needsUpdate = true;
        break;
    };

    this.mtlComponent.material = material;
  }
});

AFRAME.registerComponent('glasses-material', {
  schema: {
    mtlIdx: {type: 'int'}
  },

  init: function() {
    this.mtlComponent = this.el.components['material'];
    let textureCube = new THREE.CubeTextureLoader()
      .setPath( './img/env/04/' )
      .load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );

    let material = this.material = new THREE.MeshPhysicalMaterial({
      emissive: 0xF2FFFF,
      envMap: textureCube,
      side: THREE.DoubleSide,
      transparent: true,
    });
  },

  update: function() {
    let material = this.material;

    switch (this.data.mtlIdx) {
      case 0:
        material.metalness = 1.0;
        material.roughness = 0.1;
        material.color.setHex( 0xAAAAAA );
        material.emissiveIntensity = 0.6;
        material.opacity = 0.25;
        break;
      case 1:
        material.metalness = 0.9;
        material.roughness = 0.35;
        material.clearCoat = 1.0;
        material.color.setHex( 0x2C134D );
        material.emissiveIntensity = 0.0;
        material.opacity = 0.45;
        break;
      case 2:
        material.metalness = 1.0;
        material.roughness = 0.5;
        material.clearCoat = 0.0;
        material.color.setHex( 0xB38F73 );
        material.emissiveIntensity = 0.0;
        material.opacity = 1.0;
        break;
      case 3:
        material.metalness = 0.0;
        material.roughness = 0.75;
        material.clearCoat = 0.0;
        material.color.setHex( 0xABE9DE );
        material.emissiveIntensity = 0.0;
        material.opacity = 1.0;
        break;
    };

    this.mtlComponent.material = material;
  }
});
