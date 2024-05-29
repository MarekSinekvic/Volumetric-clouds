createGLCanv("", 500, 500);
canv.width = 1000;
canv.height = 500;
window.onresize = function () {
	canv.width = window.innerWidth;
	canv.height = window.innerHeight;
}

var startTime = new Date();
var deltaTime = 0;
var frame = 0;
var rFps = 0;

var frameCountForSample = 5;
var fps = 0;
const stockVertS = `attribute vec2 a_Position;void main(void){gl_Position=vec4(a_Position.xy,0.,1.);}`;

function Control() {
	const S = 20.*deltaTime;
	if (input.keyboard.char == 'w') {
		origin = [
			origin[0] + basis[0][0] * S,
			origin[1] + basis[0][1] * S,
			origin[2] + basis[0][2] * S,
		];
	}
	if (input.keyboard.char == 'a') {
		origin = [
			origin[0] + -basis[1][0] * S,
			origin[1] + -basis[1][1] * S,
			origin[2] + -basis[1][2] * S,
		];
	}
	if (input.keyboard.char == 's') {
		origin = [
			origin[0] + -basis[0][0] * S,
			origin[1] + -basis[0][1] * S,
			origin[2] + -basis[0][2] * S,
		];
	}
	if (input.keyboard.char == 'd') {
		origin = [
			origin[0] + basis[1][0] * S,
			origin[1] + basis[1][1] * S,
			origin[2] + basis[1][2] * S,
		];
	}
	if (input.keyboard.char == 'r') {
		origin = [
			origin[0] + basis[2][0] * S,
			origin[1] + basis[2][1] * S,
			origin[2] + basis[2][2] * S,
		];
	}
	if (input.keyboard.char == 'f') {
		origin = [
			origin[0] + -basis[2][0] * S,
			origin[1] + -basis[2][1] * S,
			origin[2] + -basis[2][2] * S,
		];
	}
}

let basis = [
	[0,0,1],
	[1,0,0],
	[0,1,0],
];
let origin = [0,0,0];

function rotateBasis(rot) {
	basis[0] = [
		Math.cos(rot[1]) * Math.sin(rot[0]),
		Math.sin(rot[1]),
		Math.cos(rot[0]) * Math.cos(rot[1])
	];
	basis[1] = [
		Math.cos(rot[0]),
		0,
		-Math.sin(rot[0])
	];
	basis[2] = [
		-Math.sin(rot[1]) * Math.sin(rot[0]),
		Math.cos(rot[1]),
		Math.cos(rot[0]) * -Math.sin(rot[1])
	];
}

let Rotation = [0,0];
document.addEventListener('mousemove', (e)=>{
	if (input.mouse.click == 3) {
		Rotation[0] += e.movementX*0.01;
		Rotation[1] += -e.movementY*0.01;
	}
});

gl.clearColor(0,0,0,1);
initShaders(gl,stockVertS,document.getElementById('fs-shader').text);
gl.viewport(0, 0, canv.width, canv.height);
initVertexBuffers(gl);
function render() {
	deltaTime = (new Date() - startTime);
	startTime = new Date();
	fps += 1000/deltaTime;
	if (frame % frameCountForSample == 0) {
		rFps = fps/frameCountForSample;
		fps = 0;
	}
	Control();
	rotateBasis(Rotation);
    gl.uniform2fv(gl.getUniformLocation(gl.program, 'u_Resolution'), [canv.width, canv.height]);
    gl.uniform1i(gl.getUniformLocation(gl.program, 'u_Frame'), frame);
	
    gl.uniform3fv(gl.getUniformLocation(gl.program, 'rayOrigin'), origin);
    gl.uniform3fv(gl.getUniformLocation(gl.program, 'forwardBasis'), basis[0]);
    gl.uniform3fv(gl.getUniformLocation(gl.program, 'rightBasis'), basis[1]);
    gl.uniform3fv(gl.getUniformLocation(gl.program, 'upBasis'), basis[2]);

	gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.finish()

	frame++;
	requestAnimationFrame(render);
};
requestAnimationFrame(render);