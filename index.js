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

async function generateViews($, views = []) {
  var html = ''
  for (var view of views) {
    var v = lodash.get($, `app.views.${view}`)
    if (!v) {
      createFile('views', view)
    }
    if (typeof v == 'function') {
      html += `${await v($)}\n`
    }
  }
  return html
}

function generateScripts($, scripts = []) {
  if (!scripts.length) {
    return ''
  }
  var html = '<script>\n'
  for (var script of scripts) {
    var s = lodash.get($, `app.scripts.${script}`)
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
  return html
}

// title: Example low code page
// desc: This it the meta description
// layout: main
// filters:
//   - authenticate
//   - login-required
// setups:
//   - load-project-data
// scripts:
//   - handleClick
//   - handleToggleSection
// views:
//   - hero
//   - intro
//   - content
//   - outro
function page(content) {
  var {
    title,
    desc,
    layout,
    filters = [],
    setups = [],
    scripts = [],
    views = []
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
    var html = generateScripts($, scripts)
    html += await generateViews($, views)
    return html
  }
}

// Example low code layout:
// head:
//   - scripts
//   - views
// body:
//   - scripts
//   - views
function layout(content) {
  var { head = {}, body = {} } = content

  return async function ($) {
    var html = '<!DOCTYPE html>\n'
    html += `<html lang="${$.lang || 'en'}">\n`
    html += '  <head>\n'
    html += generateScripts($, head.scripts)
    html += await generateViews($, head.views)
    html += '  </head>\n'
    html += '  <body>\n'
    html += generateScripts($, body.scripts)
    html += await generateViews($, body.views)
    html += '  </body>\n'
    html += `</html>\n`
    return html
  }
}

// filters:
//   - auth
//   - require-account
// flows:
//   - do
//   - something
// allow:
//   query:
//     - id
// deny:
//   values:
//     - password
// validate:
//   query:
//     id:
//       is: id
//   values:
//     name:
//       is: string
// db:
//   path: project/find
//   query:
//     id: $query.id
//   values: $values
// keep:
//   - id
//   - name
// remove:
//   - email
//   - password
// return:
//   ok: 1
function action(content) {
  console.log(content)
  console.log('ACTION')
  var { return: ret } = content

  return async function ($) {
    return ret
  }
}

module.exports = { page, layout, action }
