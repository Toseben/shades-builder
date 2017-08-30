const lut_vert = require('raw-loader!../shaders/lut.vert');
const lut_frag = require('raw-loader!../shaders/lut.frag');

module.exports = THREE.LUTShader = {

	uniforms: {
		"tDiffuse": { type: "t", value: new THREE.Texture() },
		"tLookup": { type: "t", value: new THREE.Texture() },
		"resolution": { type: "vec2", value: new THREE.Vector2() },
		"t": { type: "f", value: 0.0 }
	},

	vertexShader: lut_vert,
	fragmentShader: lut_frag

};
