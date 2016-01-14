/**
 * Step 5
 * Where you write the generator specific files (routes, controllers, etc)
 */

const fs = require('fs')
const path = require('path')
const TRAILS_TEMPLATE = path.dirname(require.resolve('trails/archetype'))

export default {
  genericApi () {
    this.fs.copy(path.resolve(TRAILS_TEMPLATE, 'api/services', '**'), this.destinationPath('api/services'))
    this.fs.copy(path.resolve(TRAILS_TEMPLATE, 'api/models', '**'), this.destinationPath('api/models'))
  },
  serverDependentApi () {
    const server = this.answers['web-engine']
    const dest = this.destinationPath()
    const PROJECT_PATH = this.destinationPath('node_modules/trailpack-' + server)
    const WEB_SERVER_ARCH = path.resolve(PROJECT_PATH, 'archetype', '**')

    this.npmInstall('trailpack-' + server, {
      save: true
    }, (err) => {
      if (err)
        return
      //FIXME: always fail
      //fs.accessSync(PROJECT_PATH)
      //fs.accessSync(path.resolve(PROJECT_PATH, 'archetype'))

      this.fs.copy(WEB_SERVER_ARCH, dest)
    });

  },
  templateEngineConfig () {
    let templateEngine = this.answers['template-engine']
    this.fs.copy(path.resolve(TRAILS_TEMPLATE, 'config', templateEngine, '**'), this.destinationPath('config'))
  },
  root () {
    this.fs.copy(path.resolve(TRAILS_TEMPLATE, '.trailsrc'), this.destinationPath('.trailsrc'))
    this.fs.copy(path.resolve(TRAILS_TEMPLATE, 'index.js'), this.destinationPath('index.js'))
    this.fs.copy(path.resolve(TRAILS_TEMPLATE, 'server.js'), this.destinationPath('server.js'))
    this.fs.copy(path.resolve(TRAILS_TEMPLATE, 'api/index.js'), this.destinationPath('api/index.js'))
  },
  pkg () {
    // node:app generator will merge into this
    if (!this.options['skip-install']) {
      let trailsPackage = require(path.resolve(TRAILS_TEMPLATE, 'package.json'))
      this.fs.writeJSON(this.destinationPath('package.json'), trailsPackage)
    }

  }
};
