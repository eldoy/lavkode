var { lodash, mkdir, write, exist } = require('extras')
var path = require('path')

function defaultFunction(name) {
  if (name.startsWith('app/views')) {
    return [
      'module.exports = async function ($) {',
      '  return /* HTML */ `' + name + '`',
      '}',
      ''
    ].join('\n')
  }
  if (name.startsWith('app/scripts')) {
    return [
      'module.exports = async function () {',
      `  return ''`,
      '}',
      ''
    ].join('\n')
  }
}

// 'views', 'layout.head'
function createFile(dir, name) {
  var base = `app/${dir}`
  mkdir(base)
  var file = `${base}/${name.replace(/\./g, path.sep)}.js`
  if (!exist(file)) {
    write(file, defaultFunction(file))
  }
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

    if (filters.length) {
      await $.filters(filters)
    }

    if (setups.length) {
      await $.setups(setups)
    }

    var html = ''
    for (var view of views) {
      var v = lodash.get(app, `views.${view}`)
      if (!v) {
        createFile('views', view)
      }
      if (typeof v == 'function') {
        html += `${await v($)}\n`
      }
    }
    if (scripts.length) {
      html += '<script>\n'
      for (var script of scripts) {
        var s = lodash.get(app, `scripts.${script}`)
        if (!s) {
          createFile('scripts', script)
        }
        if (typeof s == 'function') {
          var name = script.split('.').reverse()[0]
          html += `window.${s.name || name} = ${s}\n`
        }
        if (typeof s == 'object') {
          for (var name of s) {
            var fn = s[name]
            if (typeof fn == 'function') {
              html += `window.${s.name} = ${s}\n`
            }
          }
        }
      }
      html += '</script>\n'
    }
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
