var { lodash, mkdir, write, exist } = require('extras')
var path = require('path')

function defaultPage(name) {
  return [
    'module.exports = async function($) {',
    '  return /* HTML */ `' + name + '`',
    '}',
    ''
  ].join('\n')
}

// title: Example low code page
// desc: This it the meta description
// layout: main
// filters:
//   - authenticate
//   - login-required
// setups:
//   - load-project-data
// views:
//   - hero
//   - intro
//   - content
//   - outro
// scripts:
//   - handleClick
//   - handleToggleSection

async function pack($, content, section) {
  var items = content[section] || []
  var html = ''
  for (var item of items) {
    var key = `${section}.${item}`
    var i = lodash.get($.app, key)
    if (typeof i == 'function') {
      html += await i($)
    } else {
      var base = `app/${section}`
      mkdir(base)
      var name = `${base}/${item.replace(/\./g, path.sep)}.js`
      if (!exist(name)) {
        write(name, defaultPage(name))
      }
    }
  }
  return html
}

function page(app, content) {
  var {
    title,
    desc,
    layout,
    filters = [],
    setups = [],
    views = [],
    scripts = []
  } = content

  return async function ($) {
    $.page.title = title
    $.page.desc = desc
    $.page.layout = layout

    var html = ''
    html += await pack($, content, 'views')
    html += await pack($, content, 'scripts')
    return html
  }
}

function layout(app, content) {
  console.log(content)
}

function action(app, content) {
  console.log(content)
}

module.exports = { page, layout, action }
