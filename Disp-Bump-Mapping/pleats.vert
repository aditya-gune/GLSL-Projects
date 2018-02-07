#version 330 compatibility

out vec2 vST;
out vec3 vMCposition;
out vec3 vNormal;
out vec3 vLight;
out vec3 vEye;

uniform float uK;
uniform float uB;
uniform float uLightX;
uniform float uLightY;
uniform float uLightZ;

vec3 LIGHTPOS   = vec3( uLightX, uLightY, uLightZ );

const float PI = 3.1415926;

void
main( )
{
	vec4 p = vec4(gl_Vertex.x, gl_Vertex.y, uK*cos(uB*gl_Vertex.x)*cos(gl_Vertex.y), 1.);
	
	float dzdx = (0-uK) * uP * sin(p.x * uP) * cos(p.y);
	float dzdy = (0-uK) * sin(2*PI*uP) * p.x;
	
	vec3 Tx = vec3(1., 0., dzdx);
	vec3 Ty = vec3(0., 1., dzdy);
	
	vec3 normal = normalize(cross(Tx, Ty));
	
	vST = gl_MultiTexCoord0.st;
	vMCposition  = gl_Vertex.xyz;
	vec4 vECposition = ( gl_ModelViewMatrix * p );
	
	vNormal = normalize(gl_NormalMatrix * normal);
	vLight = LIGHTPOS - vECposition.xyz;
	vEye = vec3(0, 0, 0) - vECposition.xyz;

	gl_Position = gl_ModelViewProjectionMatrix * p;
}