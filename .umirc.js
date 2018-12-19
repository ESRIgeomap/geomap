var fs = require('fs');

const publicUrl = './public';

// ref: https://umijs.org/config/
export default {
  base: '/',
  publicPath: '/public/',
  targets: {
    ie: 11,
  },
  plugins: [
    // new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
    //   PUBLIC_URL: publicUrl,
    //   // You can pass any key-value pairs, this was just an example.
    //   // WHATEVER: 42 will replace %WHATEVER% with 42 in index.html.
    // }),
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: 'umitest',
        library: 'react',
        pwa: false,
        hd: false,
        dll: false,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /components\//,
            /constants\//,
            /middleware\//,
            /utils\//,
          ],
        },
        hardSource: false,
      },
    ],
  ],
  browserslist: ['> 1%', 'last 2 versions'],
};
