import React from 'react';
import ReactDom from 'react-dom';
import PopupContent from '../../components/callout/CalloutPopupTemplat';

import * as jsapi from '../jsapi';

class Sketch {
  constructor(view) {
    this.state = {};
    this.editGraphic = null;
    this.sceneView = view;
    // // lid 2018-08-20 添加删除绘制范围方法调用
    // this.clearSketch();
  }

  async DrawComplete(callback) {
    if (!this.tempGraphicsLayer) {
      const [GraphicsLayer, SketchViewModel] = await jsapi.load([
        'esri/layers/GraphicsLayer',
        'esri/widgets/Sketch/SketchViewModel',
      ]);
      this.tempGraphicsLayer = new GraphicsLayer({
        id: 'graphicLayer',
        elevationInfo: {
          mode: 'relative-to-ground',
          offset: 10,
          unit: 'meters',
        },
      });
      this.sceneView.map.add(this.tempGraphicsLayer);
      this.sketchViewModel = new SketchViewModel({
        view: this.sceneView,
        layer: this.tempGraphicsLayer,
        pointSymbol: {
          // type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
          // url: './images/pointSymbol.png',
          // width: '18px',
          // height: '27px',
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          style: "square",
          color: "#8A2BE2",
          size: "16px",
          outline: { // autocasts as new SimpleLineSymbol()
            color: [255, 255, 255],
            width: 3
          }
        },
        polylineSymbol: {
          type: 'simple-line', // autocasts as new SimpleLineSymbol()
          color: '#8A2BE2',
          width: '2px',
        },
        polygonSymbol: {
          type: 'simple-fill', // autocasts as new SimpleFillSymbol()
          color: 'rgba(138,43,226, 0.8)',
          style: 'solid',
          outline: {
            color: 'white',
            width: 1,
          },
        },
      });
    }

    // this.setUpClickHandler();

    this.sketchViewModel.on('create-complete', async event => {
      const [Graphic, PopupTemplate] = await jsapi.load(['esri/Graphic', 'esri/PopupTemplate']);
      const graphic = new Graphic({
        geometry: event.geometry,
        symbol: this.sketchViewModel.graphic.symbol,
      });
      this.tempGraphicsLayer.add(graphic);

      const div = document.createElement('div');
      ReactDom.render(<PopupContent view={this.sceneView} layer={this.tempGraphicsLayer} />, div);
      const template = new PopupTemplate({
        content: div,
      });
      if (graphic.geometry.type === 'point') {
        graphic.popupTemplate = template;
        this.sceneView.popup.open({
          features: [graphic],
          location: graphic.geometry,
        });
      }
      if (graphic.geometry.type === 'polyline') {
        const inx = graphic.geometry.paths[0].length - 1;
        const lnglat = {};
        lnglat.lng = (graphic.geometry.paths[0][inx][0] / 20037508.34) * 180;
        const mmy = (graphic.geometry.paths[0][inx][1] / 20037508.34) * 180;
        lnglat.lat =
          (180 / Math.PI) * (2 * Math.atan(Math.exp((mmy * Math.PI) / 180)) - Math.PI / 2);
        graphic.popupTemplate = template;
        this.sceneView.popup.open({
          features: [graphic],
          location: { latitude: lnglat.lat, longitude: lnglat.lng },
        });
      }
      if (graphic.geometry.type === 'polygon') {
        const inx = graphic.geometry.rings[0].length - 1;
        const lnglat = {};
        lnglat.lng = (graphic.geometry.rings[0][inx][0] / 20037508.34) * 180;
        const mmy = (graphic.geometry.rings[0][inx][1] / 20037508.34) * 180;
        lnglat.lat =
          (180 / Math.PI) * (2 * Math.atan(Math.exp((mmy * Math.PI) / 180)) - Math.PI / 2);
        graphic.popupTemplate = template;
        this.sceneView.popup.open({
          features: [graphic],
          location: { latitude: lnglat.lat, longitude: lnglat.lng },
        });
      }
      if (callback) {
        callback(event.geometry);
      }
    });
  }

  async Drawpoint(callback) {
    // this.setUpClickHandler();
    console.log(11111);
    await this.DrawComplete(callback);
    this.sketchViewModel.create('point');
  }

  async Drawline(callback) {
    // this.setUpClickHandler();
    await this.DrawComplete(callback);
    this.sketchViewModel.create('polyline');
  }

  async DrawPolygon(callback) {
    // this.setUpClickHandler();
    await this.DrawComplete(callback);
    this.sketchViewModel.create('polygon');
  }

  // lid 2018-08-15 添加sketch删除方法
  setUpClickHandler() {
    this.sceneView.on('click', event => {
      this.sceneView.hitTest(event).then(response => {
        let editGraphic;
        const results = response.results;
        if (results.length && results[results.length - 1].graphic) {
          if (!editGraphic) {
            editGraphic = results[results.length - 1].graphic;
            this.tempGraphicsLayer.remove(editGraphic);
            editGraphic = null;
          }
        }
      });
    });
  }

  clearSketch() {
    // lid 2018-08-20 添加删除绘制范围方法
    const graphiclayers = this.sceneView.map.findLayerById('graphicLayer');
    this.sceneView.map.remove(graphiclayers);
  }
}

export default Sketch;
