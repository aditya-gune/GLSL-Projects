#version 330 compatibility

out vec3  vMCposition;
out vec3  vECposition;
out float vLightIntensity; 
out vec4  vColor;

uniform float uA;
uniform float uB;
uniform float uC;
uniform float uLightX;
uniform float uLightY;
uniform float uLightZ;

vec3 LIGHTPOS   = vec3( -2., 0., 10. );
out vec2  vST;

const float PI = 3.1415926;

void
main( )
{
	vec4 p = vec4(gl_Vertex.x, gl_Vertex.y, uA*cos(uB*gl_Vertex.x)*cos(uC*gl_Vertex.y), 1.);
	
	float dzdx = (0-uA) * uB * sin(p.x * uB) * cos(p.y * uC);
	float dzdy = (0-uA) * uC * sin(p.x * uB) * cos(p.y * uC);
	
	float Tx = vec3(1., 0., dzdx);
	float Ty = vec3(0., 1., dzdy);
	
	vec3 normal = normalize(cross(Tx, Ty));
	

	vST = gl_MultiTexCoord0.st;
	vMCposition  = gl_Vertex.xyz;
	vECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;

	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}