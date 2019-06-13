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

  /**type仅做分类，组织专题树 */
   //pensiveant：图层列表数据配置
   var subjectMapConfig = [
    {
      type: '',
      key: 'L8',
      title: '项目',
      children: [
        {
          type: '',
          title: '动态更新',
          key: 'L8-1',
          children: [
            // {
            //   type: 'PRO_GPS_KEYPOINT',
            //   title: '巡检关键点',
            //   key: 'L8-1-1',
            //   url: '',
            //   opcity: 1,
            //   visible: false,
            // },
            // {
            //   type: 'WORK_QUESTION',
            //   title: '事项上报信息表',
            //   key: 'L8-1-2',
            //   url: '',
            //   opcity: 1,
            //   visible: false,
            // },
            // {
            //   type: 'PRO_THEFTCASE',
            //   title: '反打孔盗油气信息',
            //   key: 'L8-1-3',
            //   url: '',
            //   opcity: 1,
            //   visible: false,
            // },
            // {
            //   type: 'PRO_THIRDCONSTRUCTION',
            //   title: '第三方施工',
            //   key: 'L8-1-4',
            //   url: '',
            //   opcity: 1,
            //   visible: false,
            // },
            // {
            //   type: 'SYS_SUBSYSTEM_UNPATROL',
            //   title: '不巡检管段',
            //   key: 'L8-1-5',
            //   url: '',
            //   opcity: 1,
            //   visible: false,
            // },
          ],
        },
        {
          type: '',
          title: '地理国情',
          key: 'L8-2',
          children: [
            // {
            //   type: 'PRO_GPS_KEYPOINT',
            //   title: '巡检关键点',
            //   key: 'L8-2-1',
            //   url: '',
            //   opcity: 1,
            //   visible: false,
            // },
            // {
            //   type: 'WORK_QUESTION',
            //   title: '事项上报信息表',
            //   key: 'L8-2-2',
            //   url: '',
            //   opcity: 1,
            //   visible: false,
            // },
            // {
            //   type: 'PRO_THEFTCASE',
            //   title: '反打孔盗油气信息',
            //   key: 'L8-2-3',
            //   url: '',
            //   opcity: 1,
            //   visible: false,
            // },
            // {
            //   type: 'PRO_THIRDCONSTRUCTION',
            //   title: '第三方施工',
            //   key: 'L8-2-4',
            //   url: '',
            //   opcity: 1,
            //   visible: false,
            // },
            // {
            //   type: 'SYS_SUBSYSTEM_UNPATROL',
            //   title: '不巡检管段',
            //   key: 'L8-2-5',
            //   url: '',
            //   opcity: 1,
            //   visible: false,
            // },
          ],
        },
        {
          type: '',
          title: '变化监测项目',
          key: 'L8-3',
          children: [
            // {
            //   type: 'PRO_GPS_KEYPOINT',
            //   title: '巡检关键点',
            //   key: 'L8-3-1',
            //   url: '',
            //   opcity: 1,
            //   visible: false,
            // },
            // {
            //   type: 'WORK_QUESTION',
            //   title: '事项上报信息表',
            //   key: 'L8-3-2',
            //   url: '',
            //   opcity: 1,
            //   visible: false,
            // },
            // {
            //   type: 'PRO_THEFTCASE',
            //   title: '反打孔盗油气信息',
            //   key: 'L8-3-3',
            //   url: '',
            //   opcity: 1,
            //   visible: false,
            // },
            // {
            //   type: 'PRO_THIRDCONSTRUCTION',
            //   title: '第三方施工',
            //   key: 'L8-3-4',
            //   url: '',
            //   opcity: 1,
            //   visible: false,
            // },
            // {
            //   type: 'SYS_SUBSYSTEM_UNPATROL',
            //   title: '不巡检管段',
            //   key: 'L8-3-5',
            //   url: '',
            //   opcity: 1,
            //   visible: false,
            // },
          ],
        },
      ],
    },
    {
      type: '',
      key: 'L7',
      title: '年份',
      children: [
        {
          type: '',
          title: '2019年',
          key: 'L7-1',
          children: [
            {
              type: 'ImagerLayerYear',
              title: '影像数据2014',
              key: 'L7-1-1',
              url: 'https://geomap.arcgisonline.cn/arcgis/rest/services/test_Image/ImageServer',
              year: '2014',
              opcity: 1,
              visible: false,
            },
            {
              type: 'ImagerLayerYear',
              title: '影像数据2015',
              key: 'L7-1-2',
              url: 'https://geomap.arcgisonline.cn/arcgis/rest/services/test_Image/ImageServer',
              year: '2015',
              opcity: 1,
              visible: false,
            },
            {
              type: 'ImagerLayerYear',
              title: '影像数据2016',
              key: 'L7-1-3',
              url: 'https://geomap.arcgisonline.cn/arcgis/rest/services/test_Image/ImageServer',
              year: '2016',
              opcity: 1,
              visible: false,
            },
          ],
        },
        {
          type: '2018年',
          title: '2018年',
          key: 'L7-2',
          children: [
            // {
            //   type: '',
            //   title: '内检测记录',
            //   key: 'L7-2-1',
            //   url: '',
            //   opcity: 1,
            //   visible: false,
            // },
            // {
            //   type: '',
            //   title: '内检测记录',
            //   key: 'L7-2-2',
            //   url: '',
            //   opcity: 1,
            //   visible: false,
            // },
          ],
        },
        {
          type: 'InspFeatures',
          title: '2017年',
          key: 'L7-3',
          children: [
            // {
            //   type: '',
            //   title: '疑似漏报环焊缝异常',
            //   key: 'L7-3-1',
            //   url: '',
            //   opcity: 1,
            //   visible: false,
            // },
            // {
            //   type: '',
            //   title: '环焊缝信号排查结果',
            //   key: 'L7-3-2',
            //   url: '',
            //   opcity: 1,
            //   visible: false,
            // },
            // {
            //   type: '',
            //   title: '环焊缝异常(内检测)',
            //   key: 'L7-3-3',
            //   url: '',
            //   opcity: 1,
            //   visible: false,
            // },
          ],
        },
      ],
    },
    {
      type: 'emergency',
      key: 'L6',
      title: '变化检测',
      children: [
        {
          type: 'ImagerLayer',
          title: '00年影像变化检测数据',
          key: 'L6-1',
          url: 'https://bim.arcgisonline.cn/server/rest/services/july_06_quac_img/ImageServer',
          opcity: 1,
          goto: {
            center: [-61.9374, -9.1154],
            zoom: 10,
          },
          visible: false,
        },
        {
          type: 'ImagerLayer',
          title: '06年影像变化检测数据',
          key: 'L6-2',
          url: 'https://bim.arcgisonline.cn/server/rest/services/july_00_quac_img/ImageServer',
          opcity: 1,
          goto: {
            center: [-61.9374, -9.1154],
            zoom: 10,
          },
          visible: false,
        },
      ],
    },
    {
      type: 'pipedanger',
      key: 'L4',
      title: '水面积提取',
      children: [
        {
          type: 'ImagerLayer',
          title: 'landsat波段2',
          key: 'L4-1',
          url: 'https://bim.arcgisonline.cn/server/rest/services/Band20/ImageServer',
          opcity: 1,
          goto: {
            center: [98.264, 36.000],
            zoom: 8,
          },
          visible: false,
        },
        {
          type: 'ImagerLayer',
          title: 'landsat波段4',
          key: 'L4-2',
          url: 'https://bim.arcgisonline.cn/server/rest/services/band40/ImageServer',
          opcity: 1,
          goto: {
            center: [98.264, 36.000],
            zoom: 8,
          },
          visible: false,
        },
        {
          type: 'ImagerLayer',
          title: 'landsat波段5',
          key: 'L4-3',
          url: 'https://bim.arcgisonline.cn/server/rest/services/Band50/ImageServer',
          opcity: 1,
          goto: {
            center: [98.264, 36.000],
            zoom: 8,
          },
          visible: false,
        },
      ],
    },
    {
      type: 'basicSubject',
      key: 'L1',
      title: '基础地理',
      children: [
        {
          type: '',
          title: '行政区划',
          key: 'L1-1',
          children: [
            // {
            //   type: '',
            //   key: 'L1-1-1',
            //   title: '省级区划',
            //   url: '',
            //   opcity: 0.5,
            //   visible: true,
            // },
            // {
            //   type: '',
            //   key: 'L1-1-2',
            //   title: '市级区划',
            //   url: '',
            //   opcity: 0.5,
            //   visible: true,
            // },
            // {
            //   type: '',
            //   key: 'L1-1-3',
            //   title: '县级区划',
            //   url: '',
            //   opcity: 0.5,
            //   visible: true,
            // },
          ],
        },
      ],
    },
  ];
  window.subjectMapConfig = subjectMapConfig;
})(window);
