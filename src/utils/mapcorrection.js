import React from 'react';
import ReactDom from 'react-dom';
import MapcorrectPop from '../components/mapcorrect/MapcorrectPop';

import * as jsapi from './jsapi';

class DrawPoint {
  constructor(view) {
    this.mapTwoView = view;
    this.state = {};
    this.init = false;
    window.mapcorrectPoint = this.mapTwoView.map;
  }

  async initLayers() {
    const [] = await jsapi.load(['esri/layers/GraphicsLayer']);
    this.graphicsLayerTwo = new GraphicsLayer();
    this.mapTwoView.map.add(this.graphicsLayerTwo);
    this.mapTwoView.map.reorder(this.graphicsLayerTwo, 7);
    this.init = true;
  }

  async Drawpoint() {
    if (!this.init) {
      await this.initLayers();
    }

    this.mapTwoView.when(view => {
      this.mouseOnClick = view.on('click', async evt => {
        this.clear();
        const point = {
          type: 'point',
          longitude: evt.mapPoint.longitude,
          latitude: evt.mapPoint.latitude,
        };
        const pointSymbol = {
          type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
          url: './images/pointSymbol.png',
          width: '18px',
          height: '27px',
        };
        const [Graphic, PopupTemplate] = await jsapi.load(['esri/Graphic', 'esri/PopupTemplate']);
        const graphicPointTwo = new Graphic({
          geometry: point,
          symbol: pointSymbol,
        });
        const div = document.createElement('div');
        ReactDom.render(
          <MapcorrectPop
            view={this.mapTwoView}
            layer={this.graphicsLayerTwo}
            event={this.mouseOnClick}
            point={point}
          />,
          div
        );
        const template = new PopupTemplate({
          location: evt.mapPoint,
          title: 'Population by Gender',
          content: div,
        });
        graphicPointTwo.popupTemplate = template;
        this.mapTwoView.popup.open({
          features: [graphicPointTwo],
          location: evt.mapPoint,
        });

        this.graphicsLayerTwo.add(graphicPointTwo);
      });
    });
  }
  clear() {
    if (this.graphicsLayerTwo) {
      this.graphicsLayerTwo.removeAll();
    }
  }
}

class MapCorrect {
  static active(tool) {
    // if (this.activeTool !== undefined && this.activeTool !== null) {
    //   // this.activeTool.deactivate();
    // }
    if (tool === 'point') {
      this.activeTool = new DrawPoint(this.mapTwoView);
      this.activeTool.Drawpoint();
    }
  }
}

export default MapCorrect;
