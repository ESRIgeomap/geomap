import { jsapi } from '../constants/geomap-utils';

/**
 * 三维长度测量
 */
class Measure3Dline {
  constructor(view) {
    this.sceneView = view;
    this.state = {
      over: false,
      deactivate: false,
    };
  }

  /**
   * 加载测量线
   */
  async Measureline() {
    const [DirectLineMeasurement3D] = await jsapi.load(['esri/widgets/DirectLineMeasurement3D']);
    this.activeWidget = new DirectLineMeasurement3D({
      view: this.sceneView,
    });
    this.sceneView.ui.add(this.activeWidget, 'bottom-left');
    this.changeLineUnit();
  }

  /**
   * 修改测量微件默认单位
   */
  changeLineUnit() {
    const interval4distanceMeasureUnit = setInterval(() => {
      if (this.sceneView.activeTool) {
        this.sceneView.activeTool.unit = 'meters';
        clearInterval(interval4distanceMeasureUnit);
      }
    }, 10);
    const interval4distanceMeasurePanel = setInterval(() => {
      if (
        document.getElementsByClassName('esri-direct-line-measurement-3d__units-select esri-select')
      ) {
        if (
          document.getElementsByClassName(
            'esri-direct-line-measurement-3d__units-select esri-select'
          ).length > 0
        ) {
          clearInterval(interval4distanceMeasurePanel);
          const dom = document.getElementsByClassName(
            'esri-direct-line-measurement-3d__units-select esri-select'
          );
          const ops = dom[0];
          if (ops) {
            if (ops.length > 0) {
              for (let i = 0; i < ops.length; i += 1) {
                const tempValue = ops[i].value;
                if (tempValue === 'meters') {
                  ops[i].selected = true;
                }
              }
            }
          }
        }
      }
    }, 10);
    // 修改测量微件默认单位 end
  }

  /**
   * 销毁该widget
   */
  deactivate() {
    if (this.activeWidget) {
      this.activeWidget.destroy();
    }
  }
}

/**
 * 三维面积测量
 */
class Measure3DArea {
  constructor(view) {
    this.sceneView = view;
    this.state = {
      over: false,
      deactivate: false,
    };
  }

  /**
   * 加载测量区域
   */
  async MeasureArea() {
    const [AreaMeasurement3D] = await jsapi.load(['esri/widgets/AreaMeasurement3D']);
    this.activeWidget = new AreaMeasurement3D({
      view: this.sceneView,
    });
    this.sceneView.ui.add(this.activeWidget, 'bottom-left');
    this.changeAreaUnit();
  }

  /**
   * 修改测量微件默认单位
   */
  changeAreaUnit() {
    const interval4areaMeasureUnit = setInterval(() => {
      if (this.sceneView.activeTool) {
        this.sceneView.activeTool.unit = 'square-meters';
        clearInterval(interval4areaMeasureUnit);
      }
    }, 10);
    const interval4areaMeasurePanel = setInterval(() => {
      if (document.getElementsByClassName('esri-area-measurement-3d__units-select esri-select')) {
        if (
          document.getElementsByClassName('esri-area-measurement-3d__units-select esri-select')
            .length > 0
        ) {
          clearInterval(interval4areaMeasurePanel);
          const dom = document.getElementsByClassName(
            'esri-area-measurement-3d__units-select esri-select'
          );
          const ops = dom[0];
          if (ops) {
            if (ops.length > 0) {
              for (let i = 0; i < ops.length; i += 1) {
                const tempValue = ops[i].value;
                if (tempValue === 'square-meters') {
                  ops[i].selected = true;
                }
              }
            }
          }
        }
      }
    }, 10);
  }

  /**
   * 销毁该widget
   */
  deactivate() {
    if (this.activeWidget) {
      this.activeWidget.destroy();
    }
  }
}

// 静态类，可不用new，直接使用
class MeasureUtil {
  static active(tool) {
    if (this.activeTool !== undefined && this.activeTool !== null) {
      this.activeTool.deactivate();
      this.activeTool = null;
      return;
    }
    if (tool === 'line') {
      this.activeTool = new Measure3Dline(this.sceneView);
      this.activeTool.Measureline();
    }
    if (tool === 'area') {
      this.activeTool = new Measure3DArea(this.sceneView);
      this.activeTool.MeasureArea();
    }
  }
}

export default MeasureUtil;
