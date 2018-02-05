#version 330 compatibility
in vec3  vMCposition;
in vec3  vECposition;
in float vLightIntensity;
in vec2  vST;

uniform float uKa;
uniform float uKd;
uniform float uKs;
uniform float uShininess;
uniform vec4 uColor;
uniform vec4 uSpecularColor;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform sampler3D Noise3;

vec3
RotateNormal( float angx, float angy, vec3 n );
void
main( )
{
	vec4 nvx = texture( Noise3, uNoiseFreq*vMCposition );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	angx *= uNoiseAmp;
	vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMCposition.xy,vMCposition.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	angy *= uNoiseAmp;
	
	vec3 Normal = RotateNormal(angx, angy, vNf);
	//vec3 Light = normalize(vLf);
	//vec3 Eye = normalize(vEf);

	vec4 ambient = uKa * uColor;
	
	vec4 diffuse = uKd * uColor;
	
	/*float s = 0.;
	if (dot(Normal, Light) > 0.) {
		vec3 ref = normalize(2. * Normal * dot(Normal, Light) - Light);
		s = pow(max(dot(Eye,ref), 0.), uShininess);
	}
	*/
	vec4 specular = uKs * uColor;
	
	gl_FragColor.rgb = vec3(ambient.rgb + diffuse.rgb + specular.rgb);	// apply lighting model
}
vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}