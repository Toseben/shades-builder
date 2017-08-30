varying vec3 vPos;
varying vec2 vUv;

uniform sampler2D texture;
uniform int invert;

#pragma glslify: map = require(./includes/map.glsl)

lowp float circle(vec2 _st, float _radius){
    lowp vec2 pos = vec2(0.5)-_st;
    return smoothstep(1.0-_radius,1.0-_radius+_radius*0.2,1.-dot(pos,pos)*3.14);
}

void main() {

  lowp float dist = length(vUv - 0.5);
  lowp float shadow = map(dist, 0.24, 0.48, 0.5, 0.0);
  gl_FragColor = vec4(vec3(0.0), shadow);

  lowp vec2 modUv = (vUv - 0.5) * float(invert) + 0.5 + vec2(0.034, 0.0);
  lowp vec4 paperTex = texture2D(texture, modUv);

  if (dist < 0.4) {
    lowp float blend = smoothstep(0.4, 0.375, dist);
    gl_FragColor = mix(gl_FragColor, paperTex, blend);
  }

}
