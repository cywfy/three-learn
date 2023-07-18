import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";
import { CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";
import './demo4.css'
import { setElAttrs } from "../util/dom";

// 场景
const scene = new THREE.Scene();

// 镜头
const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.z = 3400;

// 渲染器
const renderer = new CSS3DRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("root").appendChild(renderer.domElement);

//坐标初始化
const vector = new THREE.Vector3(); //三维坐标
const spherical = new THREE.Spherical(); //球坐标

//轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true
controls.dampingFactor = 0.01
controls.autoRotate = true; //为true时，相机自动围绕目标旋转,但必须在animation循环中调用update()

var objects = []; //存放转化为3D的照片对象
var spheres = []; //用来存放目标对象的位置

function init() {
  //放图片
  for (i = 1; i < 125; i++) {
    //125为照片的个数，随便放多少，不过要适中
    var element = document.createElement("div");
    element.className = "element"; //给图片加类名即设置对应的图片大小
    element.style.backgroundImage =  `url(https://t7.baidu.com/it/u=3750036747,1838104742&fm=193&f=GIF)` || "url(./photo/" + i + ".jpg)"; // 背景图片 图片名称是 1...118.jpg
    element.style.backgroundSize = "cover"; //保持图像的宽高比例，将图片缩放到正好完全覆盖定义的背景区域
    element.name = i; // 给元素的name属性赋值，以便获取鼠标点击的当前值
    var object = new CSS3DObject(element); //可以将HTML元素作为纹理添加到3D对象中，从而创建有趣的3D特效
    scene.add(object);
    objects.push(object); //为了知道被添加到照片元素的个数
  }
  var l = objects.length;

  // 根据球形排列公式计算每个元素的位置
  for (var i = 0; i <= l; i++) {
    //该部分为固定的数学公式
    var phi = Math.acos(-1 + (2 * i) / l);
    var theta = Math.sqrt(l * Math.PI) * phi;
    // 计算元素在球面上的坐标
    var x = 800 * Math.cos(theta) * Math.sin(phi); //800代表球的半径
    var y = 800 * Math.sin(theta) * Math.sin(phi);
    var z = 800 * Math.cos(phi);

    var object = new THREE.Object3D();
    object.position.set(x, y, z); //设置对象的位置

    vector.copy(object.position).multiplyScalar(2); //将该向量与所传入的标量2进行相乘。
    object.lookAt(vector); //vector这个变量的作用，它用来作为'目标位置'，使用这个方法让这个位置的对象object看向vector这一点所在的方向
    spheres.push(object);
  }
  transform(spheres, 2000); //动画转换
}

function transform(spheres, duration) {
  for (var i = 0; i < objects.length; i++) {
    var object = objects[i];
    var target = spheres[i];
    new TWEEN.Tween(object.position) //过渡图片移动的位置
      .to(
        { x: target.position.x, y: target.position.y, z: target.position.z },
        Math.random() * duration + duration
      ) //改变当前模型的位置
      .easing(TWEEN.Easing.Exponential.InOut) //运动曲线
      .start(); //开启动画

    new TWEEN.Tween(object.rotation) //过渡图片旋转
      .to(
        { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();
  }
}

function animate() {
  TWEEN.update();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

window.addEventListener("mousedown", clickMouse);

// 鼠标单击事件
function clickMouse(e) {
  if (!e) {
    let e = window.event;
  }
  let tname = e.target.name; //获取点击图片的名称
  if (typeof tname == "undefined" || tname == "") {
    if (!controls.autoRotate) controls.autoRotate = true;
    //鼠标点击的不是照片  
    let div = document.getElementById("popup");
    div.style.display = "none"; //隐藏元素
  } else {
    controls.autoRotate = false;
    Popup(tname);
  }

  // 放大的图片
  function Popup(tname) {
    let w = window.innerWidth;
    let h = window.innerHeight;
    let div = document.getElementById("popup");
    setElAttrs(div.style, {
      display: 'block',
      backgroundImage: 'url(https://t7.baidu.com/it/u=3750036747,1838104742&fm=193&f=GIF)' || "url(./photo/" + tname + ".jpg)",
      backgroundSize: '100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: h * 0.7 + "px",
      width: h * 0.6 + "px",
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      margin: 'auto',
      borderRadius: '5px'
    })
}

init(); //初始化并形成球体照片墙
animate(); //每隔一段时间渲染

export default animate;
