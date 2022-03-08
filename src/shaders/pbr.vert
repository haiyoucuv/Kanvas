
attribute vec3 pos;
attribute vec3 normal;// 法向量
attribute vec2 uv;// uv

uniform mat4 normalMat;// 法线矩阵

uniform mat4 vp;// vp
uniform mat4 model;// m

varying vec3 v_normal;
varying vec3 v_pos;
varying vec2 v_uv;

void main(){

    vec4 fragPos = model * vec4(pos, 1.0);// 顶点位置
    gl_Position = vp * fragPos;

    v_pos = vec3(fragPos);
    v_uv = uv;

    // 光线和法向量关系
    v_normal = mat3(normalMat) * normal;// 归一化

}
