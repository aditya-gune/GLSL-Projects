#version 330 compatibility

out vec2 vST;
out vec3 vMCposition;
out vec3 vNormal;
out vec3 vLight;
out vec3 vEye;

uniform float uK;
uniform float uP;
uniform float uLightX;
uniform float uLightY;
uniform float uLightZ;

vec3 LIGHTPOS   = vec3( uLightX, uLightY, uLightZ );

const float PI = 3.1415926;

void
main( )
{
	//get the pixel we are currently at and displace z
	vec4 p = vec4(gl_Vertex.x, gl_Vertex.y, uK * (1.-gl_Vertex.y) * sin(2*PI*gl_Vertex.x/uP), 1.);
	
	//get dzdx and dzdy for the tangent lines
	float dzdx = uK * (1. - p.y) * (2*PI/uP) * cos (2*PI*p.x/uP);
	float dzdy = (0-uK) * sin(2*PI*p.x/uP);
	
	//create the tangent vectors
	vec3 Tx = vec3(1., 0., dzdx);
	vec3 Ty = vec3(0., 1., dzdy);
	
	//get the normal by taking the cross product
	vec3 normal = normalize(cross(Tx, Ty));
	
	vST = gl_MultiTexCoord0.st;
	vMCposition  = gl_Vertex.xyz;
	vec4 vECposition = ( gl_ModelViewMatrix * p );
	
	vNormal = normalize(gl_NormalMatrix * normal);
	vLight = LIGHTPOS - vECposition.xyz;
	vEye = vec3(0, 0, 0) - vECposition.xyz;

	gl_Position = gl_ModelViewProjectionMatrix * p;
}