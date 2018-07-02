require('dotenv').config()

const test = require('ava')
const fetch = require('node-fetch')

const {frontendStatus} = require('../scripts/index.js')

const newLine= "\r\n"
const DOMAIN = process.env.DOMAIN
const datasetsToTest = [
  {
    "owner": "core",
    "name": "finance-vix"
  },
  {
    "owner": "test",
    "name": "redirection-test-dataset"
  }
]

test(`finance-vix works on ${DOMAIN}`, async t => {
  const status = await frontendStatus(datasetsToTest[0],DOMAIN,newLine)
  t.is(status.name, `${datasetsToTest[0].name}`)
  t.is(status.page_status, '200:OK')
  t.is(status.page_title, 'OK')
  t.is(status.dataset_title, 'OK')
  t.is(status.readme, 'OK')
  t.is(status.csv_links, '200:OK')
  t.is(status.json_links, '200:OK')
  t.is(status.zip_links, '200:OK')
  t.is(status.datapackage_json, '200:OK')
  t.is(status.tables, 'OK')
  t.is(status.graphs, 'OK')
})

test(`finance-vix-private works on ${DOMAIN}`, async t => {
  const options = {
    headers: {
      cookie: `jwt=${process.env.AUTH_TOKEN}`
    }
  }
  const status = await frontendStatus(datasetsToTest[1],DOMAIN,newLine,options)
  t.is(status.name, `${datasetsToTest[1].name}`)
  t.is(status.page_status, '200:OK')
  t.is(status.page_title, 'OK')
  t.is(status.dataset_title, 'OK')
  t.is(status.readme, 'OK')
  t.is(status.csv_links, '200:OK')
  t.is(status.json_links, '200:OK')
  t.is(status.zip_links, '200:OK')
  t.is(status.datapackage_json, '200:OK')
  t.is(status.tables, 'OK')
  t.is(status.graphs, 'OK')
})
test(`finance-vix-private does not work when logged out on ${DOMAIN}`, async t => {
  let response = await fetch(`${DOMAIN}/${datasetsToTest[1].owner}/${datasetsToTest[1].name}`)
  t.is(response.status, 404)
  response = await fetch(`${DOMAIN}/${datasetsToTest[1].owner}/${datasetsToTest[1].name}/datapackage.json`)
  t.is(response.status, 404)
  response = await fetch(`${DOMAIN}/${datasetsToTest[1].owner}/${datasetsToTest[1].name}/r/vix_daily.csv`)
  t.is(response.status, 404)
  response = await fetch(`${DOMAIN}/${datasetsToTest[1].owner}/${datasetsToTest[1].name}/r/vix_daily.json`)
  t.is(response.status, 404)
  response = await fetch(`${DOMAIN}/${datasetsToTest[1].owner}/${datasetsToTest[1].name}/r/datapackage_zip.zip`)
  t.is(response.status, 404)
})
test(`finance-vix-private does not work when logged in but not owner on ${DOMAIN}`, async t => {
  const options = {
    headers: {
      cookie: `jwt=test`
    }
  }
  let response = await fetch(`${DOMAIN}/${datasetsToTest[1].owner}/${datasetsToTest[1].name}`, options)
  t.is(response.status, 404)
  response = await fetch(`${DOMAIN}/${datasetsToTest[1].owner}/${datasetsToTest[1].name}/datapackage.json`, options)
  t.is(response.status, 404)
  response = await fetch(`${DOMAIN}/${datasetsToTest[1].owner}/${datasetsToTest[1].name}/r/vix_daily.csv`, options)
  t.is(response.status, 404)
  response = await fetch(`${DOMAIN}/${datasetsToTest[1].owner}/${datasetsToTest[1].name}/r/vix_daily.json`, options)
  t.is(response.status, 404)
  response = await fetch(`${DOMAIN}/${datasetsToTest[1].owner}/${datasetsToTest[1].name}/r/datapackage_zip.zip`, options)
  t.is(response.status, 404)
})
