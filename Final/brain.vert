#version 330 compatibility

out vec3 vMCposition;
out vec3 vCenter;

void
main( )
{
	vCenter = vec3( 0., 0., 0. );
	vMCposition = gl_Vertex.xyz;
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}