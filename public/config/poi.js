/**
 * POI FindTask Config
 */

(function(window) {
  // 'http://nanping.arcgisonline.cn/arcgis/rest/services/nanping/wyspoi/MapServer', // Map Service
  // 'http://nanping.arcgisonline.cn/arcgis/rest/services/Hosted/POI/FeatureServer/0',

  var hostServer = 'https://geomap.arcgisonline.cn/arcgis';
  var serviceRoot = hostServer + '/rest/services';

  var poi = serviceRoot + '/nanping/wyspoi/FeatureServer/0';

  window.tdtCfg = {
    // maxBound: '114.9,29.4,119.6,34.6', //安徽省范围
    maxBound: '115.7,39.4,117.4,41.6', //北京市范围
  };

  window.poiCfg = [
    {
      url: poi,
      searchFields: ['name'],
      query: "name LIKE '%$key$%'",
      catquery: "type like '$code$%'",
      displayField: 'name',
      locationField: 'address',
    },
  ];

  // 表面注记服务
  window.remarkCfg = {
    url: poi,
  };
})(window);
