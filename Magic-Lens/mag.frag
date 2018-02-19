uniform sampler2D InUnit;
// uniform float Ang;
uniform float TEdge, TSharp;
uniform float ResS, ResT;
uniform bool EdgeDetect;

const float PI = 3.14159265;
const float PI_OVER_4 = PI/4.;
const float SIN_PI_OVER_4 = 0.707;


void main()
{
	vec2 st = gl_TexCoord[0].st;
	vec3 irgb = texture2D( InUnit,  st ).rgb;
	vec4 color = vec4( 1., 0., 0., 1. );

	if( EdgeDetect )
	{
		vec2 stp0 = vec2(1./ResS,  0. );
		vec2 st0p = vec2(0.     ,  1./ResT);
		vec2 stpp = vec2(1./ResS,  1./ResT);
		vec2 stpm = vec2(1./ResS, -1./ResT);
		float i00 =   dot( texture2D( InUnit, st ).rgb, vec3(0.2125,0.7154,0.0721) );
		float im1m1 = dot( texture2D( InUnit, st-stpp ).rgb, vec3(0.2125,0.7154,0.0721) );
		float ip1p1 = dot( texture2D( InUnit, st+stpp ).rgb, vec3(0.2125,0.7154,0.0721) );
		float im1p1 = dot( texture2D( InUnit, st-stpm ).rgb, vec3(0.2125,0.7154,0.0721) );
		float ip1m1 = dot( texture2D( InUnit, st+stpm ).rgb, vec3(0.2125,0.7154,0.0721) );
		float im10 =  dot( texture2D( InUnit, st-stp0 ).rgb, vec3(0.2125,0.7154,0.0721) );
		float ip10 =  dot( texture2D( InUnit, st+stp0 ).rgb, vec3(0.2125,0.7154,0.0721) );
		float i0m1 =  dot( texture2D( InUnit, st-st0p ).rgb, vec3(0.2125,0.7154,0.0721) );
		float i0p1 =  dot( texture2D( InUnit, st+st0p ).rgb, vec3(0.2125,0.7154,0.0721) );
		float h = -1.*im1p1 - 2.*i0p1 - 1.*ip1p1  +  1.*im1m1 + 2.*i0m1 + 1.*ip1m1;
		float v = -1.*im1m1 - 2.*im10 - 1.*im1p1  +  1.*ip1m1 + 2.*ip10 + 1.*ip1p1;
	

		float mag = sqrt( h*h + v*v );
		vec3 target = vec3( mag,mag,0. );
		color = vec4( mix( irgb, target, TEdge ), 1. );
	}
	else
	{
		vec2 stp0 = vec2(1./ResS,  0. );
		vec2 st0p = vec2(0.     ,  1./ResT);
		vec2 stpp = vec2(1./ResS,  1./ResT);
		vec2 stpm = vec2(1./ResS, -1./ResT);
		vec3 i00 =   texture2D( InUnit, st ).rgb;
		vec3 im1m1 = texture2D( InUnit, st-stpp ).rgb;
		vec3 ip1p1 = texture2D( InUnit, st+stpp ).rgb;
		vec3 im1p1 = texture2D( InUnit, st-stpm ).rgb;
		vec3 ip1m1 = texture2D( InUnit, st+stpm ).rgb;
		vec3 im10 =  texture2D( InUnit, st-stp0 ).rgb;
		vec3 ip10 =  texture2D( InUnit, st+stp0 ).rgb;
		vec3 i0m1 =  texture2D( InUnit, st-st0p ).rgb;
		vec3 i0p1 =  texture2D( InUnit, st+st0p ).rgb;
		vec3 target = vec3(0.,0.,0.);
		target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
		target += 2.*(im10+ip10+i0m1+i0p1);
		target += 4.*(i00);
		target /= 16.;
		color = vec4( mix( target, irgb, TSharp ), 1. );
	}



#define NOTDEF

#ifdef NEGATIVE
	color.rgb = vec3(1.,1.,1.) - irgb;
#endif

#ifdef BRIGHTNESS
	vec3 target = vec3( 0., 0., 0. );
	color = vec4( mix( target, irgb, T ), 1. );
#endif

#ifdef CONTRAST
	vec3 target = vec3( 0.5, 0.5, 0.5 );
	color = vec4( mix( target, irgb, T ), 1. );
#endif

#ifdef SATURATION
	float lum = dot( irgb, vec3(0.2125,0.7154,0.0721) );
	vec3 target = vec3( lum, lum, lum );
	color = vec4( mix( target, irgb, T ), 1. );
#endif

#ifdef SHARPNESS
	vec2 stp0 = vec2(1./ResS,  0. );
	vec2 st0p = vec2(0.     ,  1./ResT);
	vec2 stpp = vec2(1./ResS,  1./ResT);
	vec2 stpm = vec2(1./ResS, -1./ResT);
	vec3 i00 =   texture2D( InUnit, st ).rgb;
	vec3 im1m1 = texture2D( InUnit, st-stpp ).rgb;
	vec3 ip1p1 = texture2D( InUnit, st+stpp ).rgb;
	vec3 im1p1 = texture2D( InUnit, st-stpm ).rgb;
	vec3 ip1m1 = texture2D( InUnit, st+stpm ).rgb;
	vec3 im10 =  texture2D( InUnit, st-stp0 ).rgb;
	vec3 ip10 =  texture2D( InUnit, st+stp0 ).rgb;
	vec3 i0m1 =  texture2D( InUnit, st-st0p ).rgb;
	vec3 i0p1 =  texture2D( InUnit, st+st0p ).rgb;
	vec3 target = vec3(0.,0.,0.);
	target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
	target += 2.*(im10+ip10+i0m1+i0p1);
	target += 4.*(i00);
	target /= 16.;
	color = vec4( mix( target, irgb, T ), 1. );
#endif

#ifdef EDGE
	vec2 stp0 = vec2(1./ResS,  0. );
	vec2 st0p = vec2(0.     ,  1./ResT);
	vec2 stpp = vec2(1./ResS,  1./ResT);
	vec2 stpm = vec2(1./ResS, -1./ResT);
	float i00 =   dot( texture2D( InUnit, st ).rgb, vec3(0.2125,0.7154,0.0721) );
	float im1m1 = dot( texture2D( InUnit, st-stpp ).rgb, vec3(0.2125,0.7154,0.0721) );
	float ip1p1 = dot( texture2D( InUnit, st+stpp ).rgb, vec3(0.2125,0.7154,0.0721) );
	float im1p1 = dot( texture2D( InUnit, st-stpm ).rgb, vec3(0.2125,0.7154,0.0721) );
	float ip1m1 = dot( texture2D( InUnit, st+stpm ).rgb, vec3(0.2125,0.7154,0.0721) );
	float im10 =  dot( texture2D( InUnit, st-stp0 ).rgb, vec3(0.2125,0.7154,0.0721) );
	float ip10 =  dot( texture2D( InUnit, st+stp0 ).rgb, vec3(0.2125,0.7154,0.0721) );
	float i0m1 =  dot( texture2D( InUnit, st-st0p ).rgb, vec3(0.2125,0.7154,0.0721) );
	float i0p1 =  dot( texture2D( InUnit, st+st0p ).rgb, vec3(0.2125,0.7154,0.0721) );
	float h = -1.*im1p1 - 2.*i0p1 - 1.*ip1p1  +  1.*im1m1 + 2.*i0m1 + 1.*ip1m1;
	float v = -1.*im1m1 - 2.*im10 - 1.*im1p1  +  1.*ip1m1 + 2.*ip10 + 1.*ip1p1;
	

	float mag = sqrt( h*h + v*v );
	//vec3 target = vec3( mag,mag,mag );
	vec3 target = vec3( mag,mag,0. );
	color = vec4( mix( irgb, target, T ), 1. );
#endif

#ifdef EMBOSS
	vec2 stp0 = vec2( 1./ResS,  0. );
	vec2 st0p = vec2( 0.     ,  1./ResT );
	vec2 stpp = vec2( 1./ResS,  1./ResT );
	vec2 stpm = vec2( 1./ResS, -1./ResT );

	vec3 c00   = texture2D( InUnit, st ).rgb;
	vec3 cm1m1 = texture2D( InUnit, st-stpp ).rgb;
	vec3 cp1p1 = texture2D( InUnit, st+stpp ).rgb;
	vec3 cm1p1 = texture2D( InUnit, st-stpm ).rgb;
	vec3 cp1m1 = texture2D( InUnit, st+stpm ).rgb;
	vec3 cm10  = texture2D( InUnit, st-stp0 ).rgb;
	vec3 cp10  = texture2D( InUnit, st+stp0 ).rgb;
	vec3 c0m1  = texture2D( InUnit, st-st0p ).rgb;
	vec3 c0p1  = texture2D( InUnit, st+st0p ).rgb;

	float Angr = Ang * (PI/180.);

	vec3 diffs;

	if( 0.*PI_OVER_4 <= Angr  &&  Angr <= 1.*PI_OVER_4 )
	{
		float t = ( Angr - 0.*PI_OVER_4 ) / PI_OVER_4;
		diffs = (  (c00-cp10)*sin( (1.-t)*PI_OVER_4 ) + (c00-cp1p1)*sin( t*PI_OVER_4 )  ) / SIN_PI_OVER_4;
	}
	else if( 1.*PI_OVER_4 < Angr  &&  Angr <= 2.*PI_OVER_4 )
	{
		float t = ( Angr - 1.*PI_OVER_4 ) / PI_OVER_4;
		diffs = (  (c00-cp1p1)*sin( (1.-t)*PI_OVER_4 ) + (c00-c0p1)*sin( t*PI_OVER_4 )  ) / SIN_PI_OVER_4;
	}
	else if( 2.*PI_OVER_4 < Angr  &&  Angr <= 3.*PI_OVER_4 )
	{
		float t = ( Angr - 2.*PI_OVER_4 ) / PI_OVER_4;
		diffs = (  (c00-c0p1)*sin( (1.-t)*PI_OVER_4 ) + (c00-cm1p1)*sin( t*PI_OVER_4 )  ) / SIN_PI_OVER_4;
	}
	else if( 3.*PI_OVER_4 < Angr  &&  Angr <= 4.*PI_OVER_4 )
	{
		float t = ( Angr - 3.*PI_OVER_4 ) / PI_OVER_4;
		diffs = (  (c00-cm1p1)*sin( (1.-t)*PI_OVER_4 ) + (c00-cm10)*sin( t*PI_OVER_4 )  ) / SIN_PI_OVER_4;
	}
	else if( 4.*PI_OVER_4 < Angr  &&  Angr <= 5.*PI_OVER_4 )
	{
		float t = ( Angr - 4.*PI_OVER_4 ) / PI_OVER_4;
		diffs = (  (c00-cm10)*sin( (1.-t)*PI_OVER_4 ) + (c00-cm1m1)*sin( t*PI_OVER_4 )  ) / SIN_PI_OVER_4;
	}
	else if( 5.*PI_OVER_4 < Angr  &&  Angr <= 6.*PI_OVER_4 )
	{
		float t = ( Angr - 5.*PI_OVER_4 ) / PI_OVER_4;
		diffs = (  (c00-cm1m1)*sin( (1.-t)*PI_OVER_4 ) + (c00-c0m1)*sin( t*PI_OVER_4 )  ) / SIN_PI_OVER_4;
	}
	else if( 6.*PI_OVER_4 < Angr  &&  Angr <= 7.*PI_OVER_4 )
	{
		float t = ( Angr - 6.*PI_OVER_4 ) / PI_OVER_4;
		diffs = (  (c00-c0m1)*sin( (1.-t)*PI_OVER_4 ) + (c00-cp1m1)*sin( t*PI_OVER_4 )  ) / SIN_PI_OVER_4;
	}
	else if( 7.*PI_OVER_4 < Angr )
	{
		float t = ( Angr - 7.*PI_OVER_4 ) / PI_OVER_4;
		diffs = (  (c00-cp1m1)*sin( (1.-t)*PI_OVER_4 ) + (c00-cp10)*sin( t*PI_OVER_4 )  ) / SIN_PI_OVER_4;
	}

	float max = diffs.r;
	if( abs(diffs.g) > abs(max) )
		max = diffs.g;
	if( abs(diffs.b) > abs(max) )
		max = diffs.b;

	float gray = clamp( max + .5, 0., 1. );
	vec4 grayVersion  = vec4( gray, gray, gray, 1. );
	vec4 colorVersion = vec4( gray*c00, 1. );
	color = mix( grayVersion, colorVersion, T );
#endif


	gl_FragColor = color;
}
