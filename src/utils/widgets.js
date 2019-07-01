import React from 'react';
import ReactDOM from 'react-dom';
import Overviewmap from '../components/overviewmap/Overviewmap';
import Basemap from '../components/mapviewer/basemap/';

export default {
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
  // 底图
  async createBasemapGallery(view) {
    // BasemapGallery
    const basemapGalleryDiv = document.createElement('div');
    basemapGalleryDiv.style.position = 'absolute';
    basemapGalleryDiv.style.bottom = '25px';
    basemapGalleryDiv.style.right = '10px';
    basemapGalleryDiv.style.zIndex = '6';
    basemapGalleryDiv.id = 'basemapGalleryDiv';

    window.agsGlobal.container.appendChild(basemapGalleryDiv);
    ReactDOM.render(<Basemap />, basemapGalleryDiv);
  },
};
