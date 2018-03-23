#version 330 compatibility

uniform float	uTime;		// "Time", from Animate( )
out vec2  	vST;		// texture coords
out vec3 vColor;
out  vec3  vN;		// normal vector
out  vec3  vL;		// vector from point to light
out  vec3  vE;		// vector from point to eye
uniform int uAnimate;
vec3 LightPosition = vec3(  7., 7., 7. );

const float PI = 	3.14159265;
const float AMP = 	0.2;		// amplitude
const float W = 	2.;		// frequency

void
main( )
{ 

	vColor = vec3(.8, .7, .2); // set rgb from xyz!
	vec3 nVertex = gl_Vertex.xyz;
	if(uAnimate == 1){
		nVertex.x = gl_Vertex.x * gl_MultiTexCoord0.t * (uTime/2);
		nVertex.y = gl_Vertex.y * gl_MultiTexCoord0.s * (uTime/2);
	}
	//nVertex.z = gl_MultiTexCoord0.s * uTime;
	vST = vec2(sin(gl_MultiTexCoord0.s) * uTime, cos(gl_MultiTexCoord0.t) / uTime);
	vec4 ECposition = gl_ModelViewMatrix * vec4( nVertex, 1. );
	vN = normalize( gl_NormalMatrix * gl_Normal );	// normal vector
	vL = LightPosition - ECposition.xyz;		// vector from the point
												// to the light position
	vE = vec3( 0., 0., 0. ) - ECposition.xyz;	// vector from the point
												// to the eye position 
	gl_Position = gl_ModelViewProjectionMatrix * vec4(nVertex, 1);

}
