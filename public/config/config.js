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
    * webSceneId：三维地图基础底图
    * */
    webMapId: '6a3cc3c01d804736aa27242798a6dc75',
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


    multidateItemone: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer',

    multidateItemtwo:
      'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',

    multidateItemthree: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer',

    multidateItemfour:
      'http://thematic.geoq.cn/arcgis/rest/services/ThematicMaps/administrative_division_boundaryandlabel/MapServer',

    multidateItemfive: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunityENG/MapServer',

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
      key: '3d1fdc740ed3a782d22e916adb43c36e',

      queryBound: '-180,90,180,90',
    },
  };

  window.geosearchcfg = searchConfig;
  window.appcfg = config;
})(window);
