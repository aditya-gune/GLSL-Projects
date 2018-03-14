#version 400 compatibility
#extension GL_EXT_gpu_shader4: enable
#extension GL_EXT_geometry_shader4: enable

layout( triangles ) in;
layout( triangle_strip, max_vertices=204 ) out;
in vec3		vNormal[3];
out float	gLightIntensity;
out vec3	gl_Position;

//uniform bool uModelCoords;
uniform	int uLevel;
//uniform float uQuantize;
uniform vec4 uColor;

const vec3 lightPos = vec3( 0., 10., 0. );
float Quantize( float f );
vec3 QuantizeVec3( vec3 v );
void ProduceVertex( float s, float t );

vec3 V0, V01, V02;
float uQuantize = 50.;
bool uModelCoords = false;
void
main()
{

	V01 = ( gl_PositionIn[1] - gl_PositionIn[0] ).xyz;
	V02 = ( gl_PositionIn[2] - gl_PositionIn[0] ).xyz;
	V0  =   gl_PositionIn[0].xyz;
	int numLayers = 1 << uLevel;

	float dt = 1. / float( numLayers );

	float t_top = 1.;

	for( int it = 0; it < numLayers; it++ )
	{
		float t_bot = t_top - dt;
		float smax_top = 1. - t_top;
		float smax_bot = 1. - t_bot;

		int nums = it + 1;
		float ds_top = smax_top / float( nums - 1 );
		float ds_bot = smax_bot / float( nums );

		float s_top = 0.;
		float s_bot = 0.;

		for( int is = 0; is < nums; is++ )
		{
			ProduceVertex( s_bot, t_bot );
			ProduceVertex( s_top, t_top );
			s_top += ds_top;
			s_bot += ds_bot;
		}

		ProduceVertex( s_bot, t_bot );
		EndPrimitive();

		t_top = t_bot;
		t_bot -= dt;
	}

}
float
Quantize( float f )
{
	f *= uQuantize;
	f += .5;		// round-off
	int fi = int( f );
	f = float( fi ) / uQuantize;
	return f;
}
vec3
QuantizeVec3( vec3 v )
{
	vec3 vv;
	vv.x = Quantize( v.x );
	vv.y = Quantize( v.y );
	vv.z = Quantize( v.z );
	return vv;
}
void
ProduceVertex( float s, float t )
{
		/*Turn that (s,t) into an (nx,ny,nz)
		Transform and normalize that (nx,ny,nz)
		Use the (nx,ny,nz) to produce gLightIntensity

		Turn that same (s,t) into an (x,y,z)
		If you are working in ????? coordinates,
				multiply that (x,y,z) by the ModelView matrix
		Quantize that (x,y,z)
		If you are working in ????? coordinates,
				multiply that (x,y,z) by the ModelView matrix

		Multiply that (x,y,z) by the Projection matrix to produce gl_Position*/
	

	
	const vec3 lightPos = vec3( 0., 10., 0. );

	vec3 v = V0 + s*V01 + t*V02;
	vec3 n = v;
	n = normalize(n);
	vec3 tnorm = normalize( gl_NormalMatrix * n );	// the transformed normal	
	gLightIntensity  = abs(  dot( normalize(lightPos - n.xyz), tnorm )  );
	
	vec4 ECposition;
	
	if(uModelCoords){
		 ECposition = gl_ModelViewMatrix * vec4( n, 1. );
	}
	else{
		ECposition = vec4( n, 1. );
	}
	
	//QuantizeVec3(v);

	gl_Position = (gl_ProjectionMatrix * ECposition).xyz;
	EmitVertex();
}



