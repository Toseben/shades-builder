#define LUT_FLIP_Y

varying vec2 vUv;
uniform float t;
uniform vec2 resolution;
uniform sampler2D tDiffuse;
uniform sampler2D tLookup;

#pragma glslify: lut = require('glsl-lut')

void main () {
  gl_FragColor = texture2D(tDiffuse, vUv);

  lowp float contrast = 1.25;
  gl_FragColor.rgb = ((gl_FragColor.rgb - 0.5) * max(contrast, 0.0)) + 0.5;

  lowp float blendLookup = 0.25;
  gl_FragColor = mix(gl_FragColor, lut(gl_FragColor, tLookup), blendLookup);
}
