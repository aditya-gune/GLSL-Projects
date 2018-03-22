#version 330 compatibility

in vec3 vECposition;
in vec3 vMCposition;
in vec3 vCenter;

uniform bool uDiscard;
uniform bool uEyePosition;
uniform sampler3D Noise3;
uniform float uA;
uniform float uMaxHeight;
uniform float uETA;

float scale;
vec4  sky;
vec4  cloud;
float bias;
float tol;
float noiseamp;
float f;

float
Pulse( float min, float max, float tol, float t )
{
	float a = min - tol;
	float b = min + tol;

	float c = max - tol;
	float d = max + tol;

	return  smoothstep(a,b,t) - smoothstep(c,d,t);
}

vec3
Pastel( float r, float g, float b )
{
	float maxvalue =  max( r, max( g, b ) );
	float rp = r + f*( maxvalue - r );
	float gp = g + f*( maxvalue - g );
	float bp = b + f*( maxvalue - b );
	return vec3( rp, gp, bp );
}

void
main( )
{
	
	tol = 25.;
	noiseamp = 0.5;
	f = 0.;
	scale = 0.7;
	bias = 0.;
	sky = vec4(.1, .1, 1., 1.);
	cloud = vec4(0.8, 0.8, 0.8, 1.);
	vec3 coordpos = vMCposition;
	if(uEyePosition)
	{
		coordpos = vECposition;
	}
	vec4 noisevec = texture3D( Noise3, scale*coordpos );

	// get the sky color:

	float intensity = noisevec[0] + noisevec[1] + noisevec[2] + noisevec[3];	// 1.-> 3.
	intensity /= 3.;
	vec3 skycolor   = mix( sky.rgb, cloud.rgb, clamp( bias+intensity, 0., 1. ) );


	// get the oil color:

	noisevec  = texture3D( Noise3, coordpos );

	
	float rad = distance( coordpos, vCenter ) + noiseamp * ( noisevec.r - 0.5 );

	float d  = uMaxHeight * exp( -uA*rad*rad );
	int mmin = int( 2.*d*uETA/650. - .5 );
	int mmax = int( 2.*d*uETA/350. - .5 );
	int m = ( mmin + mmax ) / 2;

	float lambda = 2.*d*uETA / ( float(m)+.5 );
	vec3  oilcolor;
	vec3  color;
	float alpha;

	if( 350. <= lambda  &&  lambda <= 650. )
	{
		float B = 1. - smoothstep( 475.-tol, 475.+tol, lambda );
		float G = Pulse( 425., 575., tol, lambda );
		float R = smoothstep( 525.-tol, 525.+tol, lambda );
		oilcolor = Pastel( R, G, B );
		color = vec3( oilcolor.r*skycolor.r, oilcolor.g*skycolor.g, oilcolor.b*skycolor.b );
		alpha = smoothstep( 400., 450., lambda );
		
	}
	else
	{
		if(uDiscard)
		{
			discard;
		}
		color = vec3( 1., 1., 1. );
		alpha = 0.1;
	}
	if(alpha == 0)
	{
		discard;
	}
	else
	{
		gl_FragColor = vec4( color, alpha );
	}
}
