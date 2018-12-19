// import Camera from 'esri/Camera';
// 三维长度测量
// 静态类，可不用new，直接使用
class EyeviewUtil {
  static active(view, tool) {
    if (tool === 'eyeview') {
      const cam = view.camera.clone();
      cam.tilt = 88;
      cam.fov = 55;
      cam.heading = 7;
      this.mouseClickHandle = view.on('click', (evt) => {
        const point = view.toMap({
          x: evt.x,
          y: evt.y,
          // z: 50000,
        });
        cam.position = point;
        view.camera = cam;
        view.goTo(cam);
        this.mouseClickHandle.remove();
      });
      view.on('key-down', (evt) => {
        if (evt.key === 'a') {
          const cam2 = view.camera.clone();
          cam2.heading -= 0.5;
          view.camera = cam2;
        }
        if (evt.key === 'd') {
          const cam3 = view.camera.clone();
          cam3.heading += 0.5;
          view.camera = cam3;
        }
        if (evt.key === 'w') {
          const cam4 = view.camera.clone();
          cam4.tilt += 0.5;
          view.camera = cam4;
        }
        if (evt.key === 's') {
          const cam5 = view.camera.clone();
          cam5.tilt -= 0.5;
          view.camera = cam5;
        }
      });
    }
  }
}
export default EyeviewUtil;
