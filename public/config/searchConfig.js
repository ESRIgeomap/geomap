(function(window) {
  var baiduAK = '2436c002d1b49cde10213acef9a616e3'; // 百度地图API用户AK
  var searchConfig = {
    /*----------------- 搜索配置 ----------------*/
    typeList: [], // 查询分类经后台查询
    typeListQueryUrl: 'http://pgis.arcgisonline.cn/pgisServer/geoSolr/getTypeList', // 查询模糊查询中分类列表
    pageSize: 10, // 查询结构列表每页显示多少条
    smartTipSize: 10, // 智能提示显示多少条
    tolerance: 0.0005, // 设置属性查询时空间范围容差参数，程序中使用该系数*比例尺为半径做缓冲区
    solrQueryUrl: 'http://pgis.arcgisonline.cn/pgisServer/geoSolr/postSearch', // solr查询地址

    /*----------------- 导航配置 ----------------*/
    addressTipApiUrl:
      'http://api.map.baidu.com/place/v2/suggestion?query={keyword}&region=北京&output=json&ak=' +
      baiduAK, // 地点输入提示服务

    poiApiUrl: 'http://api.map.baidu.com/place/v2/search?query={keyword}&region=北京&coord_type=1&bounds={bounds}&page_size={pageSize}&page_num={pageNum}&output=json&ak=' + baiduAK, // 地点输入提示服务

    //  poiApiUrl:
    //   'http://map.baidu.com/?newmap=1&reqflag=pcmap&biz=1&from=webmap&da_par=baidu&pcevaname=pc4.1&c=131&qt=s&da_src=searchBox.button&wd={keyword}&src=0&wd2=&pn={pageNum}&sug=0&l=13&b=(12934490,4831059;12995930,4851795)&from=webmap&biz_forward={"scaler":1,"styles":"pl"}&sug_forward=&device_ratio=1&tn=B_NORMAL_MAP&nn=0&u_loc=12962210,4833291&ie=utf-8&t=1560154759297',

   
    driveApiUrl:
      'http://api.map.baidu.com/directionlite/v1/driving?origin={origin}&destination={destination}&ak=' +
      baiduAK, // 驾车路线规划
    rideApiUrl:
      'http://api.map.baidu.com/directionlite/v1/riding?origin={origin}&destination={destination}&ak=' +
      baiduAK, // 骑行路线规划
    walkApiUrl:
      'http://api.map.baidu.com/directionlite/v1/walking?origin={origin}&destination={destination}&ak=' +
      baiduAK, // 步行路线规划
    busApiUrl:
      'http://api.map.baidu.com/directionlite/v1/transit?origin={origin}&destination={destination}&ak=' +
      baiduAK, // 公交路线规划
    coordCovertApiUrl:
      'http://api.map.baidu.com/geoconv/v1/?coords={coords}&from={fromCoord}&to={toCoord}&ak=' +
      baiduAK, // 坐标转换API地址

  };

  window.searchConfig = searchConfig;
})(window);
