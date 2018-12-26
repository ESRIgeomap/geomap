import React from 'react';
import ReactDOM from 'react-dom';
import Getpoints from '../components/getpoints/Getpoints';
import Compass from '../components/compass/Compass';
import Zoom from '../components/zoom/Zoom';
import Overviewmap from '../components/overviewmap/Overviewmap';
import { jsapi } from '../constants/geomap-utils';
export default {
  // 罗盘
  getPoints(view) {
    const getpointsDiv = document.createElement('div');
    view.ui.add(getpointsDiv, {
      position: 'bottom-left',
    });
    ReactDOM.unmountComponentAtNode(getpointsDiv);
    ReactDOM.render(<Getpoints view={view} />, getpointsDiv);
  },
  // 罗盘
  createCompass(view) {
    // Compass
    const compassDiv = document.createElement('div');
    view.ui.add(compassDiv, {
      position: 'bottom-right',
    });
    ReactDOM.render(<Compass view={view} />, compassDiv);
  },

  // 放大缩小
  createZoom(view) {
    // Zoom
    const zoomDiv = document.createElement('div');
    view.ui.add(zoomDiv, {
      position: 'bottom-right',
    });
    ReactDOM.render(<Zoom view={view} />, zoomDiv);
  },

  // 底图
  async createBasemapGallery(view) {
    const [BasemapGallery] = await jsapi.load(['esri/widgets/BasemapGallery']);
    // BasemapGallery
    const basemapGalleryDiv = document.createElement('div');
    basemapGalleryDiv.style.position = 'absolute';
    basemapGalleryDiv.style.bottom = '-20px';
    basemapGalleryDiv.style.right = '-5px';
    const basemapGallery = new BasemapGallery({
      container: basemapGalleryDiv,
      view: view,
    });
    view.ui.add(basemapGallery, {
      position: 'bottom-right',
      index: 0,
    });
  },

  // 鹰眼
  createOverView(view) {
    const overmapDiv = document.createElement('div');
    overmapDiv.id = "overmapDiv";
    view.ui.add(overmapDiv, {
      position: 'bottom-left',
    });
    ReactDOM.render(<Overviewmap view={view} />, overmapDiv);
    // 默认2d不显示鹰眼
    overmapDiv.style.display = 'none';
  },
};
