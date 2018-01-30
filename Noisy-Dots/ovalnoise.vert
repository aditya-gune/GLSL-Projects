#version 330 compatibility

out vec3  vMCposition;
out float vLightIntensity; 
out vec4  vColor;
out float Z;
vec3 LIGHTPOS   = vec3( -2., 0., 10. );
out vec2  vST;

void
main( )
{
	

	vec3 tnorm      = normalize( gl_NormalMatrix * gl_Normal );
	vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );
	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );
	
	vST = gl_MultiTexCoord0.st;
	vMCposition  = gl_Vertex.xyz;
	vColor.r = vColor.r;
	vColor.g = vColor.g;
	vColor.b = vColor.b;
	vColor.a = 1.0;
	vColor = gl_Color;
	Z = ECposition.z;
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}