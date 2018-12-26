import { jsapi } from '../constants/geomap-utils';

class MeasureLine2D {
  constructor(view) {
    this.view = view;
    this.activeWidget = null;
  }
  async Measure() {
    //remove existing graphic
    // this.view.graphics.removeAll();
    const measureDiv = document.createElement('div');
    measureDiv.style.position = 'absolute';
    measureDiv.style.top = '70px';
    measureDiv.style.right = '100px';
    const [DistanceMeasurement2D] = await jsapi.load(['esri/widgets/DistanceMeasurement2D']);
    this.activeWidget = new DistanceMeasurement2D({
      view: this.view,
      container: measureDiv,
    });
    // skip the initial 'new measurement' button
    this.activeWidget.viewModel.newMeasurement();
    this.view.ui.add(this.activeWidget);
  }
  deactivate() {
    this.view.ui.remove(this.activeWidget);
    this.activeWidget.destroy();
    this.activeWidget = null;
  }
}

class MeasureArea2D {
  constructor(view) {
    this.mapView = view;
    this.activeWidget = null;
  }
  async Measure() {
    //remove existing graphic
    //  this.mapView.graphics.removeAll();
    const measureDiv = document.createElement('div');
    measureDiv.style.position = 'absolute';
    measureDiv.style.top = '70px';
    measureDiv.style.right = '100px';
    const [AreaMeasurement2D] = await jsapi.load(['esri/widgets/AreaMeasurement2D']);
    this.activeWidget = new AreaMeasurement2D({
      view: this.mapView,
      container: measureDiv,
    });

    // skip the initial 'new measurement' button
    this.activeWidget.viewModel.newMeasurement();

    this.mapView.ui.add(this.activeWidget);
  }
  deactivate() {
    this.mapView.ui.remove(this.activeWidget);
    this.activeWidget.destroy();
    this.activeWidget = null;
  }
}

class MeasureUtil {
  static active(tool) {
    if (this.activeTool !== undefined && this.activeTool !== null) {
      this.activeTool.deactivate();
    }
    if (tool === 'line') {
      // this.activeTool.deactivate();
      this.activeTool = new MeasureLine2D(this.mapView);
      this.activeTool.Measure();
    }
    if (tool === 'area') {
      // this.activeTool.deactivate();
      this.activeTool = new MeasureArea2D(this.mapView);
      this.activeTool.Measure();
    }
    if (tool === 'clearmeasure') {
      this.activeTool.deactivate();
    }
  }
}

export default MeasureUtil;
