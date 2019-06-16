// 三维长度测量
// 静态类，可不用new，直接使用
class SurroundRoamUtil {
  static active(tool) {
    if (this.activeTool) {
      clearInterval(this.roam);
      this.activeTool = false;
      return;
    }
    if (tool === 'roam') {
      this.activeTool = true;
      this.roam = setInterval(() => {
        this.sceneView.goTo({ heading: this.sceneView.camera.heading + 0.5 });
      }, 100);
    }
  }
}
export default SurroundRoamUtil;
