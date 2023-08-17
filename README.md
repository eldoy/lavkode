# Lavkode

Web app low code library that makes it possible to write Web Apps using JSON or YAML.

Used internally in the [Waveorb Web App Development Framework.](https://waveorb.com)

### Install

```
npm i lavkode
```

### Usage

```js
var lowcode = require('lavkode')

// Page, including layout if specified
var html = await lowcode.page($, page)

// Actions
var result = await lowcode.action($, action)
```

Generally each section in the file refers to a directory in your app with the same name, so `filters` will look for files in the `app/filters` directory for example.

If you want to include files in a deep directory structure, use dot notation:

```yml
filters:
  - auth.user
```

If the reference is a directory, it will load all files in that directory in the order it exists on the disk.

If you want to control the sort order when including a directory, prefix each file name with a number:

```
app/filters/1-login.js
app/filters/2-require-admin.js
```

### Pages

Pages have the following possible structure (example):

```yml
title: Example low code page
desc: This it the meta description
layout: main
filters:
  - authenticate
  - login-required
setups:
  - load-project-data
scripts:
  - handleClick
  - handleToggleSection
views:
  - hero
  - intro
  - content
  - outro
```

To build the page and return HTML, including layout, do this:

```js
var html = await lowcode.page($, page)
```

The default name for layouts is `main`, and will be used if not specified with the page.

Set `layout: false` to not use a layout.

### Layouts

Layouts are used with pages and have a this structure:

```yml
head:
  - scripts
  - views
body:
  - scripts
  - views
```

Layouts are not built separately, but included if specified in pages.

### Actions

Actions have the following possible structure (example):

```yml
filters:
  - auth
  - require-account
flows:
  - do
  - something
allow:
  query:
    - id
deny:
  values:
    - password
validate:
  query:
    id:
      is: id
  values:
    name:
      is: string

# If db is used, stored in result
db:
  path: project/find
  query:
    id: $query.id
  values: $values

# Fetch data from external API
fetch:
  url: https://api.eldoy.com/projects/list
  params:
    apikey: 1234

# Keep only these attributes from result
keep:
  - id
  - name

# Remove these attributes from result
remove:
  - email
  - password

# Explicit return
return:
  ok: 1
```

If the actions are named one of the following, they override the `schema` actions:

* create
* update
* delete
* upload
* find
* get
* search

### License

Created and maintained by [Eldøy Projects](https://eldoy.com)

MIT Licensed. Enjoy!
