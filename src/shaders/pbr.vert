attribute vec3 pos;
attribute vec3 normal;// 法向量
attribute vec2 uv;// uv

uniform mat4 matView;// 视图矩阵(相机矩阵)
uniform mat4 matProjection;// 投影矩阵

uniform mat4 matNormal;// 法线矩阵

uniform mat4 vp;// vp
uniform mat4 matModel;// m

varying vec3 v_normal;
varying vec3 v_pos;
varying vec2 v_uv;

void main(){

    vec4 fragPos = matModel * vec4(pos, 1.0);// 顶点位置
    gl_Position = vp * fragPos;

    v_pos = vec3(fragPos);
    v_uv = uv;

    // 光线和法向量关系
    v_normal = mat3(matNormal) * normal;

}
