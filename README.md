# geomap
## 1. 目录结构

<a name="folder--struct"></a><a name="1.1"></a>

- [1.1](#folder--struct) **工程目录**

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