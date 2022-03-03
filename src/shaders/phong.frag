precision mediump float;

varying vec3 v_normal;
varying vec3 v_pos;

uniform vec3 color;

uniform float alpha;// 透明度

uniform vec3 lightColor;// 光照颜色
uniform vec3 lightPos;// 光照方向

uniform vec3 viewPos;// 摄像机位置

float ambientStrength = 0.1;// 环境光强度
float specularStrength = 0.8;// 镜面光强度

void main(){
    vec3 lightDir = normalize(lightPos - v_pos.xyz);// 计算光线方向

    // 计算漫反射
    float nDotL = max(dot(lightDir, v_normal), 0.0);// 计算漫反射强度
    vec3 diffuse = lightColor * nDotL;// 计算漫反射

    // 计算镜面反射
    vec3 viewDir = normalize(viewPos - v_pos);// 计算观察方向向量
    vec3 reflectDir = reflect(-lightDir, v_normal);// 计算反射方向向量
    // 计算镜面分量
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = specularStrength * spec * lightColor;

    // 计算最终颜色
    vec3 result = (ambientStrength + diffuse + specular) * color;

    gl_FragColor = vec4(result, alpha);
}
