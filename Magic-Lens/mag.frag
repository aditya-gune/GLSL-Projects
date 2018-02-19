#version 330 compatibility

uniform sampler2D uImageUnit;
uniform float uSc;
uniform float uTc;
uniform float uDs;
uniform float uDt;

in vec2 vST;

void
main( )
{

	ivec2 ires = textureSize( uImageUnit, 0 );
	vec3 rgb = texture2D( uImageUnit,  vST ).rgb;
	
	float s = vST.s;
	float t = vST.t;
	
	float sLeft = uSc - (uDs/2);
	float sRight = uSc + (uDs/2);
	
	float tTop = uTc - (uDt/2);
	float tBot = uTc + (uDt/2);
	
	
	if( (s >= (uSc - (uDs/2)) && s <= (uSc + (uDs/2))) && (t >= (uTc - (uDt/2)) && t <= (uTc + (uDt/2))) ){
		gl_FragColor = vec4(1-rgb.r, 1-rgb.g, 1-rgb.b, 1);
	}
	else{
		gl_FragColor = vec4(rgb.r, rgb.g, rgb.b, 1);
	}
}
