module.exports = async function () {
  console.log('Loading data')
  let result = await fetch('/project/find', { method: 'POST' })
  let json = await result.json()
  console.log(JSON.stringify(json, null, 2))
}
