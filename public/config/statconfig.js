(function(window) {
  var config = {
    data: [
      {
        url:
          // old
          // 'http://nanping.arcgisonline.cn/arcgis/rest/services/Housing_Security/Housing_Security_4326/MapServer/0',

          // new from pg
          'https://nanping.arcgisonline.cn/arcgis/rest/services/Housing_Security/HousingSecurity_PG_4326/MapServer/0',
      },
    ],

    area: {
      url:
        'http://nanping.arcgisonline.cn/arcgis/rest/services/Base/地级政区/MapServer/0',
    },
  };

  window.statcfg = config;
})(window);
