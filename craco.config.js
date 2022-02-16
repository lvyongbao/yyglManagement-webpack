const path = require("path");
const webpack = require("webpack");
const { loaderByName } = require("@craco/craco");
const CracoLessPlugin = require("craco-less");
const SimpleProgressWebpackPlugin = require( 'simple-progress-webpack-plugin');
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const lessModuleRegex = /\.module\.less$/;
const addPath = dir => path.join(__dirname,dir);

module.exports = {
  webpack:{
    plugins: [
      // 查看打包的进度
      new SimpleProgressWebpackPlugin(),
      //打包分析
      // new BundleAnalyzerPlugin(),
    ],
    alias:{
      '@components': addPath('src/components'),
      '@routes': addPath('src/routes'),
      '@assets': addPath('src/assets'),
      '@theme': addPath('src/theme'),
      '@utils': addPath('src/utils'),
      '@models': addPath('src/models'),
    },
    configure: (webpackConfig) => {
      webpackConfig.optimization= {
        splitChunks: {
          chunks: 'async',
          minSize:  40000,
          maxAsyncRequests: 5, // 最大异步请求数
          maxInitialRequests: 4, // 页面初始化最大异步请求数
          automaticNameDelimiter: '~', // 解决命名冲突
          // name: true值将会自动根据切割之前的代码块和缓存组键值(key)自动分配命名,否则就需要传入一个String或者function.
          name: true,
          cacheGroups: {
          common: {
            name: 'chunk-common',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|react-router|redux-thunk|dva|react-router-dom|draft-js\/lib|core-js|@antv\/data-set\/build|)[\\/]/,
            priority: -10,
            },
            antd: {
            name: 'chunk-antd',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](moment|immutable\/dist|rc-calendar\/es|braft-finder\/dist|lodash|rc-tree\/es)[\\/]/,
            priority: -11,
            },
            echarts: {
            name: 'chunk-echarts',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](echarts)[\\/]/,
            priority: 10,
            },
          }
        }
      }
      // moment时间插件库过大，打包指定语言
      webpackConfig.plugins.push(new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/));
      // // 打包压缩gz,使用库 compression-webpack-plugin(^5的版本，过高会报错)
      webpackConfig.plugins.push(new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        // test: /\.js$|\.html$|\.json$|\.css/,
        test: /\.js$|\.json$|\.css/,
        threshold: 10240, // 只有大小大于该值的资源会被处理
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
        // deleteOriginalAssets: true // 删除原文件
      }));
      return webpackConfig
    },
  },
  eslint: {
    enable: false,
  },
  babel:{
    plugins:[
      [
        "import",
        { 
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true,
        }
      ]
    ]
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "#1890ff" },
            javascriptEnabled: true,
          },
        },
        
        modifyLessModuleRule: (lessModuleRule, context) => {
          lessModuleRule.test = lessModuleRegex;
          const cssLoader = lessModuleRule.use.find(loaderByName("css-loader"));
          cssLoader.options.modules = {
            localIdentName: "[local]_[hash:base64:5]"
          }
          return lessModuleRule;
        },
      },
    },
  ],
};