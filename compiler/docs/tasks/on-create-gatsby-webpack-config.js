const path = require('path')
const webpack = require('webpack') // eslint-disable-line
const loadConfig = require('./load-config')

const { cwd } = loadConfig()

module.exports = ({ actions, getConfig }) => {
  const webpackConfig = getConfig()

  let jsRule

  webpackConfig.module.rules = webpackConfig.module.rules.map(r => {
    /* eslint-disable no-param-reassign */
    if (r.test && r.test.toString() === /\.jsx?$/.toString()) {
      // fix for running gatsby inside node_modules
      r.exclude = [
        /(node_modules|bower_components)\/(?!@lona\/docs)/,
        /node_modules\/lona-docs\/node_modules/,
      ]

      // load .component as well
      r.test = /\.(jsx?|component)$/
      r.use.push({
        loader: 'lona-loader',
        options: {
          // styleFramework: 'styledcomponents',
        },
      })
      jsRule = r
    }

    return r
  })

  // use the normal js loader for lona files
  webpackConfig.module.rules.push({
    type: 'javascript/auto',
    test: /(colors|textStyles|shadows)\.json$/,
    use: jsRule.use,
  })

  webpackConfig.plugins.push(
    new webpack.ContextReplacementPlugin(/.*lona-workspace/, context => {
      Object.assign(context, {
        regExp: /^\.\/.*\.(component|json)$/,
        request: cwd,
      })
    })
  )

  if (!webpackConfig.resolve.modules) {
    webpackConfig.resolve.modules = []
  }
  // look for the node_modules next the config (useful when using @lona/docs as a global)
  webpackConfig.resolve.modules.push(path.join(cwd, 'node_modules'))
  // look for our node_modules
  webpackConfig.resolve.modules.push(
    path.join(path.dirname(__dirname), 'node_modules')
  )
  // @lona/docs has probably been installed so we need to look for sibling dependencies
  // as our own dependencies might be siblings now
  if (path.dirname(__dirname).indexOf('/node_modules/')) {
    webpackConfig.resolve.modules.push(
      path.join(
        path.dirname(__dirname).split('/node_modules/')[0],
        'node_modules'
      )
    )
  }

  // see https://github.com/webpack/webpack/issues/5600
  if (!webpackConfig.optimization) {
    webpackConfig.optimization = {}
  }
  webpackConfig.optimization.concatenateModules = true

  actions.replaceWebpackConfig(webpackConfig)
}
