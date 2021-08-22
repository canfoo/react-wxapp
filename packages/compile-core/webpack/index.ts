import webpack from 'webpack'
import * as path from 'path'
import miniprogramTarget from  './miniprogramTarget'
import { inputFullPath } from '../const'

console.log('x', path.join(inputFullPath, 'src/pages/index/index'))

export default function pack() {
    const webpackConfigure = {
        entry: {
            "src/pages/index/index": path.join(inputFullPath, 'src/pages/index/index')
        },
        context: inputFullPath,

        output: {
            path: path.resolve('dist'),
            filename: '[name].js'
        },

        mode: 'development',

        target: miniprogramTarget,

        optimization: {
            usedExports: true,

            splitChunks: {
                chunks: 'async',
                minSize: 1,
                maxSize: 0,
                minChunks: 1000000,
                maxAsyncRequests: 1000000,
                maxInitialRequests: 1000000,
                automaticNameDelimiter: '~',
                name: true,
                cacheGroups: {
                    vendors: {
                        minChunks: 1000000,
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10
                    },
                    default: {
                        minChunks: 1000000,
                        priority: -20,
                        reuseExistingChunk: true
                    },
                }
            }
        },

        devtool: 'cheap-source-map',

        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV':  '"development"',
                'global': 'wx'
            }),
        ],

        resolve: {
            alias: {},
            extensions: ['.wx.js', '.wx.jsx', '.js', '.jsx', '.wx.ts', '.wx.tsx', '.ts', '.tsx', '.json'],
            mainFields: ['weixin', 'browser', 'module', 'main']
        },

        module: {
            rules: [{
                test: /\.[jt]sx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                "@babel/plugin-transform-regenerator"
                            ]
                        }
                    },
                    {
                        loader: path.resolve(__dirname, 'info-loader.js')
                    }
                ]
            }]
        },
    }

    const compiler = webpack(webpackConfigure)


    if (true) {
        compiler.watch({
            aggregateTimeout: 300,
        } ,(err, stats) => {
            if (err) {
                handleWebpackError(err)
                return
            }
            const info = stats.toJson();
        
            if (stats.hasWarnings()) {
                info.warnings.forEach(err => {
                    console.log(`${err}`.error)
                })
            }
            
            if (stats.hasErrors()) {
                info.errors.forEach(err => {
                    console.log(`${err}`.error)
                })
            } else {
                console.log(`\n编译完成, 监听文件...`.info)
            }
        })
    } else {
        compiler.run((err, stats) => {
            if (err) {
                console.log(stats)
            }
        })
    }

}

function handleWebpackError (err) {
    console.log(err.stack || err)
    if (err.details) {
        console.error(err.details)
    }
}
