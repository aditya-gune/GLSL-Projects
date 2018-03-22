#version 330 compatibility



out vec3 vMCposition;
out vec3 vECposition;
out vec3 vCenter;

void
main( )
{
	vCenter = vec3( 0., 0., 0. );
	vMCposition = gl_Vertex.xyz;
	vECposition = vec3( gl_ModelViewMatrix * gl_Vertex );
	
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}