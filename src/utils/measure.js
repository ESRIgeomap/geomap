import * as jsapi from './jsapi';

class MeasureLine2D {
  constructor(view) {
    this.view = view;
    this.drawPolyline = this.drawPolyline.bind(this);
  }

  async Measure() {
    //remove existing graphic
    this.view.graphics.removeAll();

    const [Draw] = await jsapi.load(['esri/views/2d/draw/Draw']);
    const draw = new Draw({
      view: this.view,
    });

    // create() will return a reference to an instance of PolygonDrawAction
    const action = draw.create('polyline');

    // focus the view to activate keyboard shortcuts for drawing polygons
    this.view.focus();

    // listen polygonDrawAction events to give immediate visual feedback
    // to users as the polygon is being drawn on the view.
    action.on('vertex-add', this.drawPolyline);
    action.on('cursor-update', this.drawPolyline);
    action.on('vertex-remove', this.drawPolyline);
    action.on('redo', this.drawPolyline);
    action.on('undo', this.drawPolyline);
    action.on('draw-complete', this.drawPolyline);
  }

  async drawPolyline(event) {
    var vertices = event.vertices;

    //remove existing graphic
    this.view.graphics.removeAll();

    const [Graphic, geometryEngine] = await jsapi.load([
      'esri/Graphic',
      'esri/geometry/geometryEngine',
    ]);
    // create a new polygon
    var polyline = {
      type: 'polyline', // autocasts as Polyline
      paths: vertices,
      spatialReference: this.view.spatialReference,
    };

    // create a new graphic representing the polygon, add it to the view
    var graphic = new Graphic({
      geometry: polyline,
      symbol: {
        type: 'simple-line', // autocasts as SimpleLineSymbol
        color: 'red',
        width: 3,
        cap: 'round',
        join: 'round',
      },
    });

    this.view.graphics.add(graphic);

    // calculate the area of the polygon
    var area = geometryEngine.geodesicLength(graphic.geometry, 'kilometers');

    // start displaying the area of the polygon
    const lastSeg = vertices[vertices.length - 1];
    var graphic = new Graphic({
      geometry: {
        type: 'point',
        x: lastSeg[0],
        y: lastSeg[1],
        spatialReference: this.view.spatialReference,
      },
      symbol: {
        type: 'text',
        color: 'green',
        haloColor: 'black',
        haloSize: '1px',
        text: area.toFixed(2) + ' 公里',
        xoffset: 3,
        yoffset: 3,
        font: {
          // autocast as Font
          size: 14,
          family: 'sans-serif',
        },
      },
    });
    this.view.graphics.add(graphic);
  }

  deactivate() {
    this.view.graphics.removeAll();
  }
}

class MeasureArea2D {
  constructor(view) {
    this.mapView = view;
    this.drawPolygon = this.drawPolygon.bind(this);
  }

  async Measure() {
    //remove existing graphic
    this.mapView.graphics.removeAll();

    const [Draw] = await jsapi.load(['esri/views/2d/draw/Draw']);
    const draw = new Draw({
      view: this.mapView,
    });

    // create() will return a reference to an instance of PolygonDrawAction
    const action = draw.create('polygon');

    // focus the view to activate keyboard shortcuts for drawing polygons
    this.mapView.focus();

    // listen polygonDrawAction events to give immediate visual feedback
    // to users as the polygon is being drawn on the view.
    action.on('vertex-add', this.drawPolygon);
    action.on('cursor-update', this.drawPolygon);
    action.on('vertex-remove', this.drawPolygon);
    action.on('redo', this.drawPolygon);
    action.on('undo', this.drawPolygon);
    action.on('draw-complete', this.drawPolygon);
  }

  async drawPolygon(event) {
    var vertices = event.vertices;

    //remove existing graphic
    this.mapView.graphics.removeAll();

    const [Polygon, Graphic, geometryEngine] = await jsapi.load([
      'esri/geometry/Polygon',
      'esri/Graphic',
      'esri/geometry/geometryEngine',
    ]);
    // create a new polygon
    var polygon = new Polygon({
      rings: vertices,
      spatialReference: this.mapView.spatialReference,
    });

    // create a new graphic representing the polygon, add it to the view
    var graphic = new Graphic({
      geometry: polygon,
      symbol: {
        type: 'simple-fill', // autocasts as SimpleFillSymbol
        color: [178, 102, 234, 0.8],
        style: 'solid',
        outline: {
          // autocasts as SimpleLineSymbol
          color: [255, 255, 255],
          width: 2,
        },
      },
    });

    this.mapView.graphics.add(graphic);

    // calculate the area of the polygon
    var area = geometryEngine.geodesicArea(polygon, 'square-kilometers');
    if (area < 0) {
      // simplify the polygon if needed and calculate the area again
      var simplifiedPolygon = geometryEngine.simplify(polygon);
      if (simplifiedPolygon) {
        area = geometryEngine.geodesicArea(simplifiedPolygon, 'square-kilometers');
      }
    }
    // start displaying the area of the polygon
    var graphic = new Graphic({
      geometry: polygon.centroid,
      symbol: {
        type: 'text',
        color: 'white',
        haloColor: 'black',
        haloSize: '1px',
        text: area.toFixed(2) + ' 平方公里',
        xoffset: 3,
        yoffset: 3,
        font: {
          // autocast as Font
          size: 14,
          family: 'sans-serif',
        },
      },
    });
    this.mapView.graphics.add(graphic);
  }

  deactivate() {
    this.mapView.graphics.removeAll();
  }
}

class MeasureUtil {
  static active(tool) {
    if (this.activeTool !== undefined && this.activeTool !== null) {
      this.activeTool.deactivate();
    }
    if (tool === 'line') {
      this.activeTool = new MeasureLine2D(this.mapView);
      this.activeTool.Measure();
    }
    if (tool === 'area') {
      this.activeTool = new MeasureArea2D(this.mapView);
      this.activeTool.Measure();
    }
  }
}

export default MeasureUtil;
