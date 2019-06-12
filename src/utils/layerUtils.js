import { jsapi } from '../constants/geomap-utils';

import request from '../utils/request';

class layerUtils {
  static removeLayerByTitle(title) {
    const layer = agsGlobal.view.map.layers.find(l => {
      return l.title === title;
    });
    agsGlobal.view.map.remove(layer);
  }
  static async getRangYearByLayer(title, type) {
    if (type === 'vector') {
      const url = window.timerCompareConfig.vectorLayers.find(l => {
        return l.title === title;
      }).url;

      const res = await request(`${url}?f=json`);
      const rangs = res.data.timeInfo.timeExtent;
      const minYear = new Date(rangs[0]).getFullYear();
      const maxYear = new Date(rangs[1]).getFullYear();
      const rangYears = [];
      for (let i = minYear; i <= maxYear; i++) {
        rangYears.push(i);
      }

      return rangYears;
    }
    if (type === 'raster') {
    }
  }
  /**
   * 添加事件滑块对比图层
   * @param {*} title  图层 title
   * @param {*} type   图层类型 [vector, raster]
   */
  static async addTimeCompareLayerByTitle(title, type) {
    const layerType = window.timerCompareConfig.vectorLayers.find(l => l.title === title).type;

    if (layerType.toUpperCase() === 'FEATURELAYER') {
      const [FeatureLayer] = await jsapi.load(['esri/layers/FeatureLayer']);
      const url = window.timerCompareConfig.vectorLayers.find(l => {
        return l.title === title;
      }).url;
      let layer;
      if (
        !agsGlobal.view.map.layers.find(l => {
          return l.title === title;
        })
      ) {
        layer = new FeatureLayer({ title, url });
        agsGlobal.view.map.add(layer);
        layer.when(function() {
          agsGlobal.view.goTo(layer.fullExtent);
        });
      } else {
        layer = agsGlobal.view.map.layers.find(l => {
          return l.title === title;
        });
      }
    }
    if (layerType.toUpperCase() === 'IMAGERLAYER') {
      const [ImageryLayer] = await jsapi.load(['esri/layers/ImageryLayer']);
      const obj = window.timerCompareConfig.vectorLayers.find(l => {
        return l.title === title;
      });
      let layer;
      if (
        !agsGlobal.view.map.layers.find(l => {
          return l.title === title;
        })
      ) {
        const layer = new ImageryLayer({ title, url: obj.url });
        agsGlobal.view.map.add(layer);
        layer.when(function() {
          agsGlobal.view.goTo(layer.fullExtent);
        });
      } else {
        layer = agsGlobal.view.map.layers.find(l => {
          return l.title === title;
        });
      }
      return layer;
    }
  }
  static async getRangYearByLayer(title, type) {
    if (type === 'vector') {
      const url = window.timerCompareConfig.vectorLayers.find(l => {
        return l.title === title;
      }).url;

      const res = await request(`${url}?f=json`);
      const rangs = res.data.timeInfo.timeExtent;
      const minYear = new Date(rangs[0]).getFullYear();
      const maxYear = new Date(rangs[1]).getFullYear();
      const rangYears = [];
      for (let i = minYear; i <= maxYear; i++) {
        rangYears.push(i);
      }

      return rangYears;
    }
    if (type === 'raster') {
    }
  }
  static async refreshImageLayer(title, year) {
    const type = 'year';
    const oldLayer = agsGlobal.view.map.layers.find(l => {
      return l.title === title;
    });
    agsGlobal.view.map.remove(oldLayer);
    const [ImageryLayer] = await jsapi.load(['esri/layers/ImageryLayer']);
    const obj = window.timerCompareConfig.vectorLayers.find(l => {
      return l.title === title;
    });
    const layer = new ImageryLayer({
      title,
      url: obj.url,
      mosaicRule: { mosaicMethod: 'esriMosaicAttribute', where: type + "='" + year + "'" },
    });
    agsGlobal.view.map.add(layer);
    layer.when(function() {
      agsGlobal.view.goTo(layer.fullExtent);
    });
  }
}
export default layerUtils;
