const connection = require('mongowave')

module.exports = function (app) {
  return connection(app.config.db)
}
