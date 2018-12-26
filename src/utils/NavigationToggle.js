import { jsapi } from '../constants/geomap-utils';

// 三维长度测量
class NavigationToggle {
  constructor(view) {
    this.sceneView = view;
    this.init = false;
    this.state = {
      vm: null,
    };
  }

  async initViewModel() {
    const [NavigationToggleViewModel] = await jsapi.load([
      'esri/widgets/NavigationToggle/NavigationToggleViewModel',
    ]);
    this.state.vm = new NavigationToggleViewModel();
    this.state.vm.view = this.sceneView;
    this.init = true;
  }

  async mapPan() {
    if (!this.init) {
      await this.initViewModel();
    }
    if (this.state.vm.navigationMode !== 'pan') {
      this.state.vm.toggle();
    }
  }

  async mapRotate() {
    if (!this.init) {
      await this.initViewModel();
    }

    if (this.state.vm.navigationMode !== 'rotate') {
      this.state.vm.toggle();
    }
  }
}

// 静态类，可不用new，直接使用
class PanUtil {
  static active(view, tool) {
    if (tool === 'pan') {
      const activeTool = new NavigationToggle(view);
      activeTool.mapPan();
    }
    if (tool === 'rotate') {
      const activeTool = new NavigationToggle(view);
      activeTool.mapRotate();
    }
  }
}
export default PanUtil;
