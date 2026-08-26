type GrainientConfig = {
	timeSpeed: number;
	warpFrequency: number;
	warpSpeed: number;
	warpAmplitude: number;
	grainAmount: number;
	grainScale: number;
	contrast: number;
	saturation: number;
	zoom: number;
	color1: string;
	color2: string;
	color3: string;
};

const VERTEX = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

/* Upstream SvelteBits shader, with the uniforms this site never varies folded
   in as constants (blend angle, rotation and colour balance). */
const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uContrast;
uniform float uSaturation;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}
void main(){
  float t=iTime*uTimeSpeed;
  vec2 uv=gl_FragCoord.xy/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5;
  tuv/=max(uZoom,0.001);
  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*2.0);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*500.0+180.0));
  tuv.y*=ratio;
  float amplitude=uWarpAmplitude;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*uWarpFrequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(uWarpFrequency*1.5)+warpTime)/(amplitude*0.5);
  float s=0.05;
  float blendX=tuv.x;
  vec3 layer1=mix(uColor3,uColor2,S(-0.3-s,0.2+s,blendX));
  vec3 layer2=mix(uColor2,uColor1,S(-0.3-s,0.2+s,blendX));
  vec3 col=mix(layer1,layer2,S(0.5+s,-0.3-s,tuv.y));
  vec2 grainUv=uv*max(uGrainScale,0.001);
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;
  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=clamp(col,0.0,1.0);
  fragColor=vec4(col,1.0);
}`;

const hexToRgb = (hex: string): [number, number, number] => {
	const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
	return match
		? [parseInt(match[1], 16) / 255, parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255]
		: [1, 1, 1];
};

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
	const shader = gl.createShader(type)!;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	return shader;
};

function initGrainient(host: HTMLElement) {
	const canvas = host.querySelector('canvas');
	if (!(canvas instanceof HTMLCanvasElement)) return;

	const config = JSON.parse(host.dataset.config ?? '{}') as GrainientConfig;
	const gl = canvas.getContext('webgl2', { alpha: true, antialias: false });
	if (!gl) return;

	const resolveColor = (value: string): [number, number, number] =>
		hexToRgb(value.startsWith('--') ? getComputedStyle(host).getPropertyValue(value) : value);

	const program = gl.createProgram()!;
	gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
	gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
	gl.linkProgram(program);
	gl.useProgram(program);

	// One oversized triangle covers the clip space; a quad would need two.
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
	const position = gl.getAttribLocation(program, 'position');
	gl.enableVertexAttribArray(position);
	gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

	const uniform = (name: string) => gl.getUniformLocation(program, name);
	const uniforms = {
		iResolution: uniform('iResolution'),
		iTime: uniform('iTime'),
		uTimeSpeed: uniform('uTimeSpeed'),
		uWarpFrequency: uniform('uWarpFrequency'),
		uWarpSpeed: uniform('uWarpSpeed'),
		uWarpAmplitude: uniform('uWarpAmplitude'),
		uGrainAmount: uniform('uGrainAmount'),
		uGrainScale: uniform('uGrainScale'),
		uContrast: uniform('uContrast'),
		uSaturation: uniform('uSaturation'),
		uZoom: uniform('uZoom'),
		uColor1: uniform('uColor1'),
		uColor2: uniform('uColor2'),
		uColor3: uniform('uColor3')
	};

	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	const resize = () => {
		const { width, height } = host.getBoundingClientRect();
		canvas.width = Math.max(1, Math.floor(width * dpr));
		canvas.height = Math.max(1, Math.floor(height * dpr));
		gl.viewport(0, 0, canvas.width, canvas.height);
		gl.uniform2f(uniforms.iResolution, canvas.width, canvas.height);
	};
	const resizeObserver = new ResizeObserver(resize);
	resizeObserver.observe(host);
	resize();

	const still = matchMedia('(prefers-reduced-motion: reduce)');
	const scheme = matchMedia('(prefers-color-scheme: dark)');
	const applyColors = () => {
		gl.uniform3fv(uniforms.uColor1, resolveColor(config.color1));
		gl.uniform3fv(uniforms.uColor2, resolveColor(config.color2));
		gl.uniform3fv(uniforms.uColor3, resolveColor(config.color3));
	};

	let frame = 0;
	const start = performance.now();
	const render = (now: number) => {
		gl.uniform1f(uniforms.iTime, (now - start) * 0.001);
		gl.uniform1f(uniforms.uTimeSpeed, config.timeSpeed);
		gl.uniform1f(uniforms.uWarpFrequency, config.warpFrequency);
		gl.uniform1f(uniforms.uWarpSpeed, config.warpSpeed);
		gl.uniform1f(uniforms.uWarpAmplitude, config.warpAmplitude);
		gl.uniform1f(uniforms.uGrainAmount, config.grainAmount);
		gl.uniform1f(uniforms.uGrainScale, config.grainScale);
		gl.uniform1f(uniforms.uContrast, config.contrast);
		gl.uniform1f(uniforms.uSaturation, config.saturation);
		gl.uniform1f(uniforms.uZoom, config.zoom);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		if (!still.matches) frame = requestAnimationFrame(render);
	};

	// The hero scrolls away and never comes back, so stop drawing while hidden.
	const visible = new IntersectionObserver(([entry]) => {
		cancelAnimationFrame(frame);
		if (entry.isIntersecting) frame = requestAnimationFrame(render);
	});
	visible.observe(host);

	const repaint = () => {
		applyColors();
		if (still.matches) frame = requestAnimationFrame(render);
	};
	scheme.addEventListener('change', repaint);
	still.addEventListener('change', repaint);
	applyColors();
}

document.querySelectorAll<HTMLElement>('[data-grainient]').forEach(initGrainient);
