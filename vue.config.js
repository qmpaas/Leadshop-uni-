const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin'); //最新版本copy-webpack-plugin插件暂不兼容，推荐v5.0.0
const FileManagerPlugin = require('filemanager-webpack-plugin');

let externals =
  process.env.UNI_PLATFORM === 'h5'
    ? {
        siteInfo: 'siteInfo'
      }
    : {
        siteInfo: 'commonjs2 ../siteinfo.js'
      };
let patterns = [
  {
    from: path.join(__dirname, 'src/workers'),
    to: path.join(
      __dirname,
      'dist',
      process.env.NODE_ENV === 'production' ? 'build' : 'dev',
      process.env.UNI_PLATFORM,
      'workers'
    )
  }
];
if (process.env.UNI_PLATFORM !== 'h5') {
  patterns.push({
    from: path.join(__dirname, 'src/siteinfo.js'),
    to: 'siteinfo.js'
  });
}
let plugins =
  process.env.UNI_PLATFORM !== 'h5'
    ? [
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.join(__dirname, 'src/workers'),
              to: path.join(
                __dirname,
                'dist',
                process.env.NODE_ENV === 'production' ? 'build' : 'dev',
                process.env.UNI_PLATFORM,
                'workers'
              )
            }
          ]
        }),
        new FileManagerPlugin({
          events: {
            onEnd: {
              archive: [{ source: './dist/build/mp-weixin', destination: './../server/applet/app.zip' }]
            }
          }
        })
      ]
    : [
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.join(__dirname, 'public/index.php'),
              to: 'index.php'
            }
          ]
        }),
        new FileManagerPlugin({
          events: {
            onStart: {
              delete: [
                {
                  source: './../server/views/wechat',
                  options: {
                    force: true
                  }
                }
              ]
            },
            onEnd: {
              move: [{ source: './dist/build/h5', destination: './../server/views/wechat' }]
            }
          }
        })
      ];

module.exports = {
  css: {
    loaderOptions: {
      // 给 less-loader 传递 Less.js 相关选项
      less: {}
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        //这个是加上自己的路径，
        //注意：试过不能使用别名路径
        path.resolve(__dirname, './src/packages/common/style/theme.less')
      ]
    }
  },
  configureWebpack: {
    externals: externals,
    plugins: [
      new CopyWebpackPlugin({
        patterns: patterns
      })
    ]
  },
  chainWebpack: config => {
    // config.optimization.minimizer('terser').tap((args) => {
    //     const compress = args[0].terserOptions.compress;
    //     // 非 App 平台移除 console 代码(包含所有 console 方法，如 log,debug,info...)
    //     compress.drop_console = true;
    //     compress.pure_funcs = [
    //         '__f__', // App 平台 vue 移除日志代码
    //         // 'console.debug' // 可移除指定的 console 方法
    //     ];
    //     return args;
    // });
  }
};
