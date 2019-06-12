function pluck(array, key) {
  if (!array) return [];
  return array.map(o => o[key]);
}
class WebMap {
  constructor(view) {
    this._map = view.map;
    (this._spatialReference_wkid = view.spatialReference.wkid), (this._allLayers = []);
    this._basemap = null;
    this._init();
  }
  _init() {
    this._createBaseMap(); //底图
    this._createOperationalLayers(); //业务图层
    this._createPoltLayers(); //标绘图层
  }
  _createBaseMap() {
    const bm = this._map.basemap;
    const title = bm.title;
    const baseMapLayers = [];
    bm.baseLayers.items.map(bmlayer => {
      baseMapLayers.push({
        templateUrl: bmlayer.urlTemplate,
        url: bmlayer.url,
        copyright: bmlayer.copyright,
        fullExtent: bmlayer.fullExtent,
        opacity: bmlayer.opacity,
        visibility: bmlayer.visible,
        id: bmlayer.id,
        title: bmlayer.title,
        type: bmlayer.operationalLayerType,
        layerType: bmlayer.operationalLayerType,
      });
    });

    this._basemap = {
      title,
      baseMapLayers,
    };
  }
  _createOperationalLayers() {
    const layers = this._map.layers.items.filter(function(lyr) {
      return (
        lyr.declaredClass == 'esri.layers.MapImageLayer' ||
        lyr.declaredClass == 'esri.layers.FeatureLayer'
      );
    });
    layers.map(layer => {
      let sublayers = layer.allSublayers && layer.allSublayers.items;
      let sublayersId = pluck(sublayers, 'id');

      this._allLayers.push({
        id: layer.id,
        layerType: layer.operationalLayerType || layer.layerType,
        url: layer.url + `/${layer.layerId}`,
        visibility: layer.visible,
        visibleLayers: sublayersId || [0],
        opacity: layer.opacity,
        title: layer.title,
        itemId: layer.portalItem && layer.portalItem.id,
        // layerDefinition: layer.source.layerDefinition, 可先不定义此参数
      });
    });
  }
  _createPoltLayers() {}

  getWebMapJSON() {
    return {
      operationalLayers: this._allLayers,
      baseMap: this._basemap,
      spatialReference: {
        wkid: this._spatialReference_wkid,
      },
      authoringApp: this._map.authoringApp,
      authoringAppVersion: this._map.authoringAppVersion,
      version: '2.11',
      applicationProperties: this._map.applicationProperties,
    };
  }
}

export default WebMap;
