#version 330 compatibility
/*in vec3  vMCposition;
in vec4  vColor;
in float vLightIntensity;
in vec2  vST; */
in vec3  vReflectVector;
uniform samplerCube ReflectUnit;

/*uniform sampler2D Noise2; 
uniform float uAlpha;
uniform float uAd;
uniform float uBd;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uTol;
uniform vec4  uSquareColor;*/


void
main( )
{
	vec4 newcolor = textureCube( ReflectUnit, vReflectVector );
	gl_FragColor = newcolor;
}