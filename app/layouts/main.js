module.exports = async function ($) {
  return /* HTML */ `
    <!DOCTYPE html>
    <html lang="${$.lang}">
      <head>
        <title>${$.page.title || '♥'} - ${$.t('layouts.title')}</title>
        <link rel="icon" type="image/png" href="/img/favicon.png" />
        ${$.script('/bundle.js')} ${$.style('/bundle.css')}
        ${process.env.NODE_ENV == 'development' ? $.script('/js/dev.js') : ''}
      </head>
      <body>
        <main>${$.page.content}</main>
      </body>
    </html>
  `
}
