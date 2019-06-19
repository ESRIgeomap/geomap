import { jsapi } from '../../../constants/geomap-utils';

import request from '../../../utils/request';

class TimerSliderUtils {
  /**
   * 根据图层名称移除图层
   * @param {*} view view
   * @param {*} title 图层名称
   */
  static removeLayerByTitle(view, title) {
    const layer = view.map.layers.find(l => {
      return l.title === title;
    });
    view.map.remove(layer);
  }
  /**
   * 获取时态图层年份
   *  @param {*} view view
   * @param {*} title 图层名称
   * @param {*} type  图层类型
   */
  static async getRangYearByLayer(view,title, type) {
    if (type.toUpperCase() === 'FEATURELAYER') {
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
   * 添加时间滑块对比图层
   * @param {*} title  图层 title
   * @param {*} view   view
   */
  static async addTimeCompareLayerByTitle(view, title) {
    const layerType = window.timerCompareConfig.vectorLayers.find(l => l.title === title).type;

    if (layerType.toUpperCase() === 'FEATURELAYER') {
      const [FeatureLayer] = await jsapi.load(['esri/layers/FeatureLayer']);
      const url = window.timerCompareConfig.vectorLayers.find(l => {
        return l.title === title;
      }).url;
      let layer;
      if (
        !view.map.layers.find(l => {
          return l.title === title;
        })
      ) {
        layer = new FeatureLayer({ title, url });
        view.map.add(layer);
        layer.when(function() {
          view.goTo(layer.fullExtent);
        });
      } else {
        layer = view.map.layers.find(l => {
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
        !view.map.layers.find(l => {
          return l.title === title;
        })
      ) {
        const layer = new ImageryLayer({ title, url: obj.url });
        view.map.add(layer);
        layer.when(function() {
          view.goTo(layer.fullExtent);
        });
      } else {
        layer = view.map.layers.find(l => {
          return l.title === title;
        });
      }
      return layer;
    }
  }
  /**
   * 影像时态根据年份切换
   * @param {*} view view
   * @param {*} title 图层名称
   * @param {*} year 年份
   */
  static async refreshImageLayer(view, title, year) {
    const type = 'year';
    const oldLayer = view.map.layers.find(l => {
      return l.title === title;
    });
    view.map.remove(oldLayer);
    const [ImageryLayer] = await jsapi.load(['esri/layers/ImageryLayer']);
    const obj = window.timerCompareConfig.vectorLayers.find(l => {
      return l.title === title;
    });
    const layer = new ImageryLayer({
      title,
      url: obj.url,
      mosaicRule: { mosaicMethod: 'esriMosaicAttribute', where: type + "='" + year + "'" },
    });
    view.map.add(layer);
    layer.when(function() {
      view.goTo(layer.fullExtent);
    });
  }
}
export default TimerSliderUtils;
