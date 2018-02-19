#version 330 compatibility

uniform sampler2D uImageUnit;
uniform float uSc;
uniform float uTc;
uniform float uDs;
uniform float uDt;
uniform float uMagFactor;
uniform float uRotAngle;
uniform float uSharpFactor;
uniform float uRadius;
uniform bool uCircle;
uniform bool uSpecial;

in vec2 vST;

vec4 modify(float newS, float newT);

void
main( )
{
	ivec2 ires = textureSize( uImageUnit, 0 );
	vec3 rgb = texture2D( uImageUnit,  vST ).rgb;
	
	float s = vST.s;
	float t = vST.t;
	
	float sc = uSc;
	float tc = uTc;
	float ds = uDs;
	float dt = uDt;
	
	float sLeft = sc - (ds/2);
	float sRight = sc + (ds/2);
	
	float tTop = tc - (dt/2);
	float tBot = tc + (dt/2);
	
	float newS = s;
	float newT = t;
	
	
	
	
	if(uCircle){
		float sds = pow((s - sc), 2);
		float sdt = pow((t - tc), 2);
		
		float d = sqrt(sds + sdt);
		
		if(d <= uRadius){
			vec4 color = modify(newS, newT);
			gl_FragColor = color;
		}
		else{
			gl_FragColor = vec4(rgb.r, rgb.g, rgb.b, 1);
		}
	}
	else if( (s >= (sc - (ds/2)) && s <= (sc + (ds/2))) && (t >= (tc - (dt/2)) && t <= (tc + (dt/2))) ){
		
		vec4 color = modify(newS, newT);
		gl_FragColor = color;
	}
	else{
		gl_FragColor = vec4(rgb.r, rgb.g, rgb.b, 1);
	}
}

vec4 modify(float newS, float newT){
		newS /= uMagFactor;
		newT /= uMagFactor;
		
		newS = newS*cos(uRotAngle) - newT*sin(uRotAngle);
		newT = newS*sin(uRotAngle) + newT*cos(uRotAngle);
		
		
		
		
		vec2 st = vec2(newS, newT);
		
		vec4 newColor = texture2D( uImageUnit,  st );
		
		vec2 stp0 = vec2(1./newS,  0. );
		vec2 st0p = vec2(0.     ,  1./newT);
		vec2 stpp = vec2(1./newS,  1./newT);
		vec2 stpm = vec2(1./newS, -1./newT);
		vec3 i00 =   texture2D( uImageUnit, st ).rgb;
		vec3 im1m1 = texture2D( uImageUnit, st-stpp ).rgb;
		vec3 ip1p1 = texture2D( uImageUnit, st+stpp ).rgb;
		vec3 im1p1 = texture2D( uImageUnit, st-stpm ).rgb;
		vec3 ip1m1 = texture2D( uImageUnit, st+stpm ).rgb;
		vec3 im10 =  texture2D( uImageUnit, st-stp0 ).rgb;
		vec3 ip10 =  texture2D( uImageUnit, st+stp0 ).rgb;
		vec3 i0m1 =  texture2D( uImageUnit, st-st0p ).rgb;
		vec3 i0p1 =  texture2D( uImageUnit, st+st0p ).rgb;
		vec3 target = vec3(0.,0.,0.);
		target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
		target += 2.*(im10+ip10+i0m1+i0p1);
		target += 4.*(i00);
		target /= 16.;
		vec4 color = vec4( mix( target, newColor.rgb, uSharpFactor ), 1. );
		if(uSpecial){
			color = vec4(mix( newColor.rgb, vec3(sqrt(newColor.r), sqrt(newColor.g), sqrt(newColor.b)) , uSharpFactor), 1);
		}
		return color;
}