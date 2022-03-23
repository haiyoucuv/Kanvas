
precision mediump float;

#extension GL_OES_standard_derivatives : enable

varying vec3 v_normal;
varying vec3 v_pos;
varying vec2 v_uv;

uniform float alpha;// 透明度

uniform vec3 colorLight;// 光照颜色
uniform vec3 posLight;// 光照方向

uniform vec3 posView;// 摄像机位置

uniform vec3 color;// 颜色反照率
uniform float metallic;// 金属性
uniform float roughness;// 粗糙度
uniform float ao;

// 贴图
#ifdef USE_MAP
uniform sampler2D map;
#endif

#ifdef USE_NORMAL_MAP
uniform sampler2D normalMap;

vec3 getNormalFromMap() {
    vec3 tangentNormal = texture2D(normalMap, v_uv).rgb * 2.0 - 1.0;

    vec3 Q1  = dFdx(v_pos);
    vec3 Q2  = dFdy(v_pos);
    vec2 st1 = dFdx(v_uv);
    vec2 st2 = dFdy(v_uv);

    vec3 N  = normalize(v_normal);
    vec3 T  = normalize(Q1 * st2.t - Q2 * st1.t);
    vec3 B  = -normalize(cross(N, T));
    mat3 TBN = mat3(T, B, N);

    return normalize(TBN * tangentNormal);
}
#endif

#ifdef USE_METALLIC_MAP
uniform sampler2D metallicMap;
#endif

#ifdef USE_ROUGHNESS_MAP
uniform sampler2D roughnessMap;
#endif

#ifdef USE_AO_MAP
uniform sampler2D aoMap;
#endif

const float PI = 3.14159265359;

vec3 fresnelSchlick(float cosTheta, vec3 F0) {
    // float fresnel = pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
    float fresnel = exp2((-5.55473 * cosTheta - 6.98316) * cosTheta);
    return F0 + (1.0 - F0) * fresnel;
}

float DistributionGGX(vec3 N, vec3 H, float roughness) {
    float a      = roughness * roughness;
    float a2     = a * a;
    float NdotH  = max(dot(N, H), 0.0);
    float NdotH2 = NdotH*NdotH;

    float nom   = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;

    return nom / denom;
}

float GeometrySchlickGGX(float NdotV, float roughness) {
    float r = (roughness + 1.0);
    float k = (r * r) / 8.0;

    float nom   = NdotV;
    float denom = NdotV * (1.0 - k) + k;

    return nom / denom;
}

float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx2  = GeometrySchlickGGX(NdotV, roughness);
    float ggx1  = GeometrySchlickGGX(NdotL, roughness);

    return ggx1 * ggx2;
}

void main(){
    #ifdef USE_MAP
    vec3 baseColor = texture2D(map, v_uv).rgb;
    vec3 color = pow(baseColor, vec3(2.2));
    #endif

    #ifdef USE_METALLIC_MAP
    float metallic = texture2D(metallicMap, v_uv).r;
    #endif

    #ifdef USE_ROUGHNESS_MAP
    float roughness = texture2D(roughnessMap, v_uv).r;
    #else
    float roughness = clamp(roughness, 0.04, 1.0);// 处理粗糙度边界范围
    #endif

    #ifdef USE_AO_MAP
    float ao = texture2D(aoMap, v_uv).r;
    #endif

    #ifdef USE_NORMAL_MAP
    vec3 N = getNormalFromMap();
    #else
    vec3 N = normalize(v_normal);// 在顶点着色器已经归一化
    #endif

    // 使用透明，去掉面剔除的时候，应该吧内面的法线翻一下
    N = N * (float(gl_FrontFacing) * 2.0 - 1.0);

    vec3 V = normalize(posView - v_pos);// 视线反方向

    // 垂直反射率F0
    // 0.04为非金属近似值
    // 根据金属度进行金属流程
    vec3 F0 = vec3(0.04);
    F0 = mix(F0, color, metallic);

    // reflectance equation
    vec3 Lo = vec3(0.0);

    // calculate per-light radiance
    vec3 L = normalize(posLight - v_pos);// 计算光线方向
    vec3 H = normalize(V + L);
    float distance = length(posLight - v_pos);
    float attenuation = 1.0 / (distance * distance);
    vec3 radiance = colorLight * attenuation;

    // Cook-Torrance BRDF
    float NDF = DistributionGGX(N, H, roughness);
    float G = GeometrySmith(N, V, L, roughness);
    vec3 F = fresnelSchlick(max(dot(H, V), 0.0), F0);

    vec3 numerator = NDF * G * F;
    float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + 0.0001; // +0.0001 防止除0
    vec3 specular = numerator / denominator;

    // kS is equal to Fresnel
    vec3 kS = F;

    // 能量守恒定律，漫反射 + 镜面反射 = 1.0
    vec3 kD = vec3(1.0) - kS;

    // multiply kD by the inverse metalness such that only non-metals
    // have diffuse lighting, or a linear blend if partly metal (pure metals
    // have no diffuse light).
    kD *= 1.0 - metallic;

    // scale light by NdotL
    float NdotL = max(dot(N, L), 0.0);

    // add to outgoing radiance Lo
    Lo += (kD * color / PI + specular) * radiance * NdotL;  // note that we already multiplied the BRDF by the Fresnel (kS) so we won't multiply by kS again

    // ambient lighting (note that the next IBL tutorial will replace
    // this ambient lighting with environment lighting).
    vec3 ambient = vec3(0.03) * color * ao;

    vec3 res = ambient + Lo;

    // HDR tonemapping
    res = res / (res + vec3(1.0));
    // gamma correct
    res = pow(res, vec3(1.0/2.2));

    //    float rColor = 1.0 - dot(V, N);
    //    res = mix(res, vec3(0.5, 0.0, 0.0), rColor);

    //    if (gl_FrontFacing){
    gl_FragColor = vec4(res, alpha);
    //    } else {
    //        gl_FragColor = vec4(1.0,1.0,1.0, 1.0);
    //    }
}
