(function (window) {
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
    addressTipApiUrl: 'http://api.map.baidu.com/place/v2/suggestion?query={keyword}&region=北京&output=json&ak=' + baiduAK, // 地点输入提示服务
    driveApiUrl: 'http://api.map.baidu.com/directionlite/v1/driving?origin={origin}&destination={destination}&ak=' + baiduAK, // 驾车路线规划
    rideApiUrl: 'http://api.map.baidu.com/directionlite/v1/riding?origin={origin}&destination={destination}&ak=' + baiduAK, // 骑行路线规划
    walkApiUrl: 'http://api.map.baidu.com/directionlite/v1/walking?origin={origin}&destination={destination}&ak=' + baiduAK, // 步行路线规划
    busApiUrl: 'http://api.map.baidu.com/directionlite/v1/transit?origin={origin}&destination={destination}&ak=' + baiduAK, // 公交路线规划
  };

  window.searchConfig = searchConfig;
})(window);