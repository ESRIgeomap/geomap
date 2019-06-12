(function(window) {
  var config = {
    portal: 'http://geomap.arcgisonline.cn/arcgis/',
    /**
     *
     * App Info */
    signin: 'https://geomap.arcgisonline.cn/arcgis/cxghgeoplat/viewer/login.html',

    clientId: 'C6oLXpJMwRE7O81X',
    clientSecret: '9700f452145f47fe8efd1e5010acdb93',
    /** END of App Info */

    /** 
    * 此项目配置地图基础底图，需要从portal进行设置
    * webMapId：二维地图基础底图
    * webSceneId：三维地图基础底图1
    * */
    webMapId: '89d52b73eecb4e8aae4ed2f2aaac63c5',
    webSceneId: '2b5583be57624afab5852e457523b8bb',

    /**
     * 代理配置项
     * 说明：所有的代理均需要在此配置，例如登录
     * */
    proxy: 'http://geomap.arcgisonline.cn/Java/proxy.jsp',

    //打印服务
    printService:
      'http://geomap.arcgisonline.cn/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
    //几何服务
    geometryService:
      'http://geomap.arcgisonline.cn/arcgis/rest/services/Utilities/Geometry/GeometryServer',

    // --------------------分屏对比功能配置项----------------------------
    // 此项目配置分屏对比的左侧底图  右侧采用原有基础底图
    websplitMapId: '46af0c1e6a03401dbbaad015335df3dc',

    // --------------------多时相功能配置项----------------------------

    multidateItemone: '6a3cc3c01d804736aa27242798a6dc75',

    multidateItemtwo: '46af0c1e6a03401dbbaad015335df3dc',

    multidateItemthree: '6c23d560ff4148e6af54caa4b523cc1d',

    multidateItemfour: '15ebe38d5b9448fca8ad47c1adf7cdec',

    multidateItemfive: 'c0f8bff30a2e4589892c9c909a383880',

    initialExtent: {
      center: [116.3, 39.9],
      zoom: 9,
    },

    basemaps: {
      // default2d: {
      //   url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
      // },
      default2d: 'osm',
      // default3d: {
      //   url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
      // },
      default3d: 'osm',
    },
  };

  var searchConfig = {
    tianditu: {
      key: '2b4dbd63705acef3a76f69a71aff5a0d',

      queryBound: '-180,90,180,90',
    },
  };

  window.geosearchcfg = searchConfig;
  window.appcfg = config;
})(window);
