var lowcode = require('../../index.js')

module.exports = function (app, props) {
  var { ext, content, dir } = props
  if (ext == 'yml' || ext == 'json') {
    if (dir.startsWith('app/layouts')) {
      return lowcode.layout(content)
    }
    if (dir.startsWith('app/pages')) {
      return lowcode.page(content)
    }
    if (dir.startsWith('app/actions')) {
      return lowcode.action(content)
    }
  }
}
