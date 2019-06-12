(function(window) {
  var portalHost = 'geomap.arcgisonline.cn';
  var portalOrigin = 'http://' + portalHost;
  var portalRoot = portalOrigin + '/arcgis/';

  var config = {
    portal: portalRoot,
    /**
     * App Info
     */
    signin: 'https://geomap.arcgisonline.cn/arcgis/cxghgeoplat/viewer/login.html',

    clientId: 'C6oLXpJMwRE7O81X',
    clientSecret: '9700f452145f47fe8efd1e5010acdb93',
    /** END of App Info */

    /**
     * 此项目配置地图基础底图，需要从portal进行设置
     * webMapId：二维地图基础底图
     * webSceneId：三维地图基础底图
     * */
    webMapId: '80655ac21acd49e08e5658bab737c349',
    webSceneId: '2b5583be57624afab5852e457523b8bb',

    /**
     * 代理配置项
     * 说明：所有的代理均需要在此配置，例如登录
     * */
    proxy: portalOrigin + '/Java/proxy.jsp',

    //打印服务
    printService:
      'http://geomap.arcgisonline.cn/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
    //几何服务
    geometryService:
      'http://geomap.arcgisonline.cn/arcgis/rest/services/Utilities/Geometry/GeometryServer',

    // --------------------分屏对比功能配置项----------------------------
    // 此项目配置分屏对比的左侧底图  右侧采用原有基础底图
    websplitMapId: 'c10bb7199ef94e36b8d1d6235b1259ec',

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
  };

  var searchConfig = {
    tianditu: {
      key: '2b4dbd63705acef3a76f69a71aff5a0d',

      queryBound: '-180,90,180,90',
    },
  };
  var timerCompareConfig = {
    timeField: 'year',
    vectorLayers: [
      {
        title: 'timeslider',
        url: 'http://pgis.arcgisonline.cn/arcgis/rest/services/compare/MapServer/0',
        type: 'FeatureLayer',
        timeField: 'year',
      },
      {
        title: 'imageLayer',
        url: 'https://geomap.arcgisonline.cn/arcgis/rest/services/test_Image/ImageServer',
        type: 'ImagerLayer',
        timeField: 'year',        
      },
    ],   
  };
  var basemapConfig = [
    // {
    //   title: '彩色版(POI)',
    //   itemId: 'b9cda70403f1412294c545379d9e8579',
    //   icon: './images/basemap/tdtsl.png',
    // },
    // {
    //   title: '灰色版',
    //   itemId: 'f5c4e3e278b842a0a8a377da5a25a21b',
    //   icon: './images/basemap/bmap.png',
    // },
    // {
    //   title: '蓝黑版',
    //   itemId: '92641763d4ed4747bd01baef61112a0e',
    //   icon: './images/basemap/bmap.png',
    // },

    // {
    //   title: '英文版',
    //   itemId: '1e7d38a30cb14b90bb3b4b5d53476921',
    //   icon: './images/basemap/bmap.png',
    // },
    {
      title: '天地图矢量',
      itemId: '80655ac21acd49e08e5658bab737c349',
      icon: './images/basemap/tdtsl.png',
    },
    {
      title: '天地图影像',
      itemId: '455ae507cd8b4a929fa4c2cc343cdbce',
      icon: './images/basemap/tdtyy.png',
    },

    // {
    //   title: '水系专题图',
    //   itemId: '8b3e41166093435b8df4fa4bef876c37',
    //   icon: './images/basemap/tdtsl.png',
    // },
    // {
    //   title: '植被专题图',
    //   itemId: 'b097b337e6a34f879351e019fef569c2',
    //   icon: './images/basemap/tdtyy.png',
    // },
    // {
    //   title: '山体专题图',
    //   itemId: 'e203da2a8ada412483ffc8884fa0fff9',
    //   icon: './images/basemap/bmap.png',
    // },
  ];
  window.timerCompareConfig = timerCompareConfig;
  window.geosearchcfg = searchConfig;
  window.basemapConfig = basemapConfig;
  window.appcfg = config;
})(window);
