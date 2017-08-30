varying vec3 vPos;
varying vec2 vUv;
#pragma glslify: worley2x2 = require(./includes/worley2x2.glsl)
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

const vec3 color_BG = vec3(0.79, 0.91, 0.95);
const vec3 color_A = vec3(0.98, 0.58, 0.59);
const vec3 color_B = vec3(0.82, 0.71, 0.90);
const vec3 color_C = vec3(0.98, 0.85, 0.46);
const vec3 color_E = vec3(0.64, 0.86, 0.80);

const float g_offset = 14.0;
const float clip = 0.3;
const float e_plus = 0.0025;
const float e_minus = 0.005;

uniform float elapsedTime;
uniform sampler2D texture;

#pragma glslify: blend = require(glsl-blend-soft-light)

lowp float circle(vec2 _st, float _radius){
    vec2 pos = vec2(0.5)-_st;
    return smoothstep(1.0-_radius,1.0-_radius+_radius*0.2,1.-dot(pos,pos)*3.14);
}

void main() {

	lowp float offset = snoise2(vPos.xz * 0.5 + elapsedTime) * 1.0;
  lowp vec2 deformUv = vUv + vec2(0.0, offset) * 0.025;

  lowp float noise_A = worley2x2(deformUv * 5.0 + 1.1 + g_offset, 1.0, false).x;
	lowp float noise_B = worley2x2(deformUv * 5.0 + 2.2 + g_offset, 1.0, false).x;
	lowp float noise_C = worley2x2(deformUv * 5.0 + 3.3 + g_offset, 1.0, false).x;
	lowp float noise_D = worley2x2(deformUv * 5.0 + 4.4 + g_offset, 1.0, false).x;
	lowp float noise_E = worley2x2(deformUv * 5.0 + 5.5 + g_offset, 1.0, false).x;

	lowp float mask_A = float(noise_A > clip);
	lowp float mask_B = float(noise_B > clip);
	lowp float mask_C = float(noise_C > clip);
	lowp float mask_E = float(noise_E > clip);

	lowp float edge_A = 1.0 - (smoothstep(clip + e_plus, clip - e_minus, noise_A) * mask_A);
	lowp float edge_B = 1.0 - (smoothstep(clip + e_plus, clip - e_minus, noise_B) * mask_B);
	lowp float edge_C = 1.0 - (smoothstep(clip + e_plus, clip - e_minus, noise_C) * mask_C);
	lowp float edge_D = smoothstep(clip, clip - 0.05, noise_D);
	lowp float edge_E = 1.0 - (smoothstep(clip + e_plus, clip - e_minus, noise_E) * mask_E);

	lowp vec3 color = color_BG;
	color = mix(color_A, color, mask_A) * edge_A;
	color = mix(color_B, color, mask_B) * edge_B;

	if (edge_D > 0.01) {
		lowp float rot = radians(45.0);
    lowp mat2 m = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));

		lowp vec2 modUv = vUv;
		modUv -= 0.5;
		modUv  = m * modUv;
		modUv += 0.5;
		modUv = fract(modUv * 160.0);

		color *= 1.0 - circle(modUv, 0.2 * edge_D);
	}

  color = mix(color_C, color, mask_C) * edge_C;
	color = mix(color_E, color, mask_E) * edge_E;

	gl_FragColor = vec4( color, 1.0 );

  lowp float paperTex = texture2D(texture, vUv * 8.0).r;
  color = blend(gl_FragColor.rgb, vec3(paperTex));
  gl_FragColor.rgb = mix(gl_FragColor.rgb, color, 0.25);
}
