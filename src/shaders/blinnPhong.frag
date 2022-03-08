precision mediump float;

varying vec3 v_normal;
varying vec3 v_pos;
varying vec2 v_uv;

uniform vec3 color;

uniform float alpha;// 透明度

uniform vec3 lightColor;// 光照颜色
uniform vec3 lightPos;// 光照方向

uniform vec3 viewPos;// 摄像机位置

uniform sampler2D u_texture;

float ambientStrength = 0.05;   // 环境光强度
float specularStrength = 0.3;   // 镜面光强度

void main(){

    vec3 color = texture2D(u_texture, v_uv).rgb;
    vec3 ambient = ambientStrength * color;

    vec3 lightDir = normalize(lightPos - v_pos);// 计算光线方向

    // 计算漫反射
    float nDotL = max(dot(lightDir, v_normal), 0.0);// 计算漫反射强度
    vec3 diffuse = color * nDotL;// 计算漫反射

    // 计算镜面反射
    vec3 viewDir = normalize(viewPos - v_pos);// 计算观察方向向量
    vec3 halfwayDir = normalize(lightDir + viewDir);    // 半程向量
    // 计算镜面分量
    float spec = pow(max(dot(v_normal, halfwayDir), 0.0), 32.0);
    vec3 specular = vec3(specularStrength) * spec;

    // 计算最终颜色
    gl_FragColor = vec4(ambient + diffuse + specular, alpha);
}
