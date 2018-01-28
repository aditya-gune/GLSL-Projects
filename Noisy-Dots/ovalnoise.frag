#version 330 compatibility
in vec3  vMCposition;
in vec4  vColor;
in float vLightIntensity;
in vec2  vST;

uniform bool uSmooth;
uniform sampler3D Noise3; 
uniform float uAlpha;
uniform float uAd;
uniform float uBd;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uTol;
uniform vec4  uSquareColor;

void
main( )
{
	// read the glman noise texture and convert it to a range of [-1.,+1.]:
	vec3 stp = uNoiseFreq * vMCposition;
	vec4 nv = texture( Noise3, stp ); 
	nv  = texture3D( Noise3, uNoiseFreq*vMCposition );
	float n = nv.r + nv.g + nv.b + nv.a;    //  1. -> 3.
	n = n - 2.;                             // -1. -> 1.

	float halfSize = uAd/2.;
	float Ar = uAd/2.;
	float Br = uBd/2.;
	float s = vST.s;
	float t = vST.t;
	float sp = 2. * s;		// good for spheres
	float tp = t;
	int numins = int( sp / uAd );
	int numint = int( tp / uAd );
	float scenter = float(numins)*uAd + Ar;
	float tcenter = float(numint)*uAd + Br;
	float ds = pow((sp - scenter)/Ar, 2);	// 0. <= ds <= halfSize
	float dt = pow((tp - tcenter)/Br, 2);	// 0. <= dt <= halfSize
	float maxDist = max( ds, dt  );
	float oldDist = sqrt( ds*ds + dt*dt );
	float newDist = n;
	float scale = newDist / oldDist;    
	gl_FragColor = vColor;		// default color
	
	ds *= scale;                            // scale by noise factor
	ds /= Ar;                               // ellipse equation

	dt *= scale;                            // scale by noise factor
	dt /= Br;                               // ellipse equation

	float d = ds*ds + dt*dt;
	
	if( (ds+dt) <= 1 )
	{
		
		if( uSmooth )
		{
			
			float t = smoothstep( halfSize-uBd, halfSize+uBd, maxDist );
			gl_FragColor = mix( uSquareColor, vColor, t );
		}
		else
		{
			gl_FragColor = mix( uSquareColor, vColor, t );;
		}
		if(uAlpha == 0)
		{
			discard;
		}
		else
		{
			gl_FragColor.a = uAlpha;
		}
		
	}
	
	gl_FragColor.rgb *= vLightIntensity;	// apply lighting model
}
