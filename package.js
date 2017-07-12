Package.describe({
  name: 'hexsprite:stats-monitor',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})

Package.onUse(function (api) {
  api.versionsFrom('1.5.1-rc.3')
  api.use('ecmascript')
  api.mainModule('stats-monitor.js', 'server')
})

Package.onTest(function (api) {
  api.use('ecmascript')
  api.use('tinytest')
  api.use('stats-monitor')
  api.mainModule('stats-monitor-tests.js', 'server')
})

Npm.depends({
  pidusage: '1.1.5',
  '@slack/client': '3.10.0',
  'circular-buffer': '1.0.2',
  lodash: '4.17.4'
})
