var lowcode = require('../../index.js')

module.exports = function (app, props) {
  var { ext, content, dir, file, trail } = props
  if (ext == 'yml' || ext == 'json') {
    if (dir.startsWith('app/layouts')) {
      return lowcode.layout(app, content)
    }
    if (dir.startsWith('app/pages')) {
      return lowcode.page(app, content)
    }
    if (dir.startsWith('app/actions')) {
      return lowcode.action(app, content)
    }
  }
}
