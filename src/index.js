// import animate from "./demo/demo1";
// import animate from "./demo/demo2";
// import animate from "./demo/demo3";
import animate from "./demo/demo4";
import WebGL from "./util/check";


if (WebGL.isWebGLAvailable()) {
  // Initiate function or other initializations here
  animate();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("root").appendChild(warning);
}
