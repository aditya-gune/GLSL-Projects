#version 330 compatibility
uniform sampler2D Noise2;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
out vec3  vMCposition;
out float vLightIntensity; 
out vec4  vColor;
out vec3 vReflectVector;

vec3 LIGHTPOS   = vec3( -2., 0., 10. );
out vec2  vST;

void
main( )
{
	vST = gl_MultiTexCoord0.st;
	vMCposition  = gl_Vertex.xyz;
	vec4 p = vec4(gl_Vertex.x, gl_Vertex.y, gl_Vertex.z, 1.);
	vec4 nv = texture2D( Noise2, uNoiseFreq * vST ); 
	nv = vec4(nv.r * uNoiseAmp, nv.g * uNoiseAmp, nv.b * uNoiseAmp, nv.a * uNoiseAmp);
	float n = nv.r + nv.g + nv.b + nv.a;    //  1. -> 3.
	n = n - 2.;                             // -1. -> 1.
	float m=n*uNoiseAmp;

	//get the pixel we are currently at and displace z
	float x = gl_Vertex.x * m;
	float y = gl_Vertex.y * m;
	float z = gl_Vertex.z * m;
	p = vec4( x,y,z, 1.);

	vec3 tnorm      = normalize( gl_NormalMatrix * gl_Normal );
	vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );
	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );
	vColor = gl_Color;
	vReflectVector = reflect( ECposition, tnorm );
	gl_Position = gl_ModelViewProjectionMatrix * p;
}