#version 330 compatibility
#extension GL_EXT_gpu_shader4: enable
#extension GL_EXT_geometry_shader4: enable

layout( triangles )  in;
layout( triangle_strip, max_vertices=204 )  out;

uniform int   uLevel;
uniform float uQuantize;
uniform bool  uModelCoords;

in  vec3  vNormal[3];
out float gLightIntensity;

vec3 V0, V01, V02;
vec3 N0, N01, N02;
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
	const vec3 lightPos = vec3( 0., 10., 0. );

	vec3 v = V0 + s*V01 + t*V02;
	vec3 n = N0 + s*N01 + t*N02;
	
	vec3 tnorm = normalize( gl_NormalMatrix * n );	// the transformed normal
	
	
	gLightIntensity  = abs(  dot( normalize(lightPos - v), tnorm )  );

	vec4 ECposition;
	if(uModelCoords)
	{
		v = QuantizeVec3(v);
		ECposition = gl_ModelViewMatrix * vec4( (v), 1. );
	}
	else
	{
		ECposition = gl_ModelViewMatrix * vec4( (v), 1. );
		vec3 k = ECposition.xyz;
		k = QuantizeVec3(k);
		ECposition = vec4(k, ECposition.w);
	}
	gl_Position = gl_ProjectionMatrix * ECposition;
	EmitVertex();
}



void
main()
{
	V01 = ( gl_PositionIn[1] - gl_PositionIn[0] ).xyz;
	V02 = ( gl_PositionIn[2] - gl_PositionIn[0] ).xyz;
	V0  =   gl_PositionIn[0].xyz;
	
	N01 = ( vNormal[1] - vNormal[0] ).xyz;
	N02 = ( vNormal[2] - vNormal[0] ).xyz;
	N0  =   vNormal[0].xyz;

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
