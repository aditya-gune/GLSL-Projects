#version 330 compatibility
in vec3  vMCposition;
in vec4  vColor;
in float vLightIntensity;
in vec2  vST;

uniform sampler2D Noise2; 
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
	
	vec4 nv = texture2D( Noise2, uNoiseFreq * vST ); 
	//nv  = texture2D( Noise2, uNoiseFreq*vMCposition );
	//nv = vec4(nv.r * uNoiseAmp, nv.g * uNoiseAmp, nv.b * uNoiseAmp, nv.a * uNoiseAmp);
	
	float n = nv.r + nv.g + nv.b + nv.a;    //  1. -> 3.
	n = n - 2.;                             // -1. -> 1.
	float m=n*uNoiseAmp;
		gl_FragColor = vColor;		
	
	//float halfSize = uAd/2.;
	float Ar = uAd/2.;
	float Br = uBd/2.;
	float s = vST.s;
	float t = vST.t;
	float sp = 2. * s;		// good for spheres
	float tp = t;
	
	int numins = int( sp / uAd );
	int numint = int( tp / uBd );
	
	float scenter = float(numins)*uAd + Ar;
	float tcenter = float(numint)*uBd + Br;
	
	float ds = pow((sp - scenter)/Ar, 2);	// 0. <= ds <= halfSize
	float dt = pow((tp - tcenter)/Br, 2);	// 0. <= dt <= halfSize
	
	float oldDist = sqrt(ds+dt);
	float newDist = oldDist+m*20.;
	float scale = newDist / oldDist;    
			// default color
	
	ds *= scale;                            // scale by noise factor
	//ds /= Ar;                               // ellipse equation

	dt *= scale;                            // scale by noise factor
	//dt /= Br;                               // ellipse equation

float d = sqrt(ds + dt);
	
	if( d<= 1 )
	{
		float t = smoothstep( 1-uTol, 1+uTol, d); //- smoothstep( 1-Ar+uTol, 1-Br+uTol, (ds+dt) ) ;
		gl_FragColor = mix( vec4(1,0,0,1), vColor, t );
		
		
	}
	else 
	{
		gl_FragColor = vColor;		
		
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
