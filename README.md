# Geomap
BY esrichina

> **Note**: Geomap是一个高可重用，标准化和可扩展的前端Web GIS应用开发框架。该框架已经在ESRI中国平台实施部门内部推广使用，成功支撑了数个项目的应用开发需求，并得到客户的良好反馈。我们希望Geomap框架可以给使用ArcGIS平台的开发者们提供一些帮助。

## 1. 功能特色
- [1.1](#folder--struct) **风格统一的地图操作工具**

  Geomap基于React封装了一系列的工具类微件，相比原生ArcGIS JSAPI中提供了更加丰富的选择，同时，所有的微件样式保持统一。

- [1.2](#folder--struct) **可复用的GIS应用功能**
  
  Geomap提供了组件化封装的一系列GIS常用的应用功能，包括二三维地图中的标注与地图纠错，配置省、市、县三级行政区划定位，以及对接天地图的API实现了POI、公交换乘、路径规划等功能。

- [1.3](#folder--struct) **基于Portal的登录/认证**

  Geomap实现了基于ArcGIS Portal的用户登录以及基于OAuth2的ClientID验证。

- [1.4](#folder--struct) **动态的图层服务树**

  Geomap实现了基于Portal Item的动态图层服务树，以及各图层的开关。

- [1.5](#folder--struct) **GP分析工具**

  Geomap实现了基于ArcGIS JSAPI 4.x调用ArcGIS GP分析Rest接口的功能，并以密度分析功能为例，实现了完整的GP分析应用交互流程。


## 2. 目录结构
- [2.1](#folder--struct) **工程目录**

  ```bash
  ├── dist                 # 输出目录
  ├── public               # dev server根目录, contentBase（打包后会完整copy到dist，不经过webpack处理）
    ├── config             # 全局配置文件
    ├── libs               # 其他3rd libs
    ├── images             # 直接通过相对路径引用的图片资源文件，包括PictureMarkerSymbol
  ├── src                  # 源代码目录
    ├── assets             # 全局资源文件（会经由webpack打包，其中小于10kb的图片会转换为内联的二进制数据）
    ├── components         # React UI 组件
    ├── middlewares        # Redux 中间件
    ├── models             # Dva models
    ├── pages              # Umi pages
    ├── services           # Used for communicate with server
    └── utils              # Utils
        └── request.js     # A util wrapped dva/fetch
    ├── app.js             # Entry file
    ├── global.css         # 全局CSS文件入口
  ├── .env                 # Node 自定义 Environment参数
  ├── .eslintignore        #
  ├── .eslintrc            # Eslint config
  ├── .gitignore           #
  ├── .prettierrc          # prettier config
  ├── .umirc.js            # Umi config
  └── package.json         #
  ```