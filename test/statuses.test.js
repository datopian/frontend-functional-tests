const test = require('ava')
require('dotenv').config()
const fetch = require('node-fetch')

const {frontendStatus} = require('../index.js')

let newLine= "\r\n"
const datasetsToTest = [
  {
    "owner": "core",
    "name": "finance-vix"
  },
  {
    "owner": "core",
    "name": "gdp-uk"
  },
  {
    "owner": "Mikanebu",
    "name": "finance-vix-private"
  }
]

const baseUrl = 'https://datahub.io'
const pkgStoreUrl = 'https://pkgstore.datahub.io'
const baseUrlTesting = 'https://testing.datahub.io'
const pkgStoreTestingUrl = 'https://pkgstore-testing.datahub.io'


test.serial('finance-vix works on production', async t => {
  const status = await frontendStatus(datasetsToTest[0],baseUrl,pkgStoreUrl,newLine)
  t.is(status.name, 'finance-vix')
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

test.serial('finance-vix works on testing', async t => {
  const status = await frontendStatus(datasetsToTest[0],baseUrlTesting,pkgStoreTestingUrl,newLine)
  t.is(status.name, 'finance-vix')
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


test.serial('finance-vix-private works on testing', async t => {
  const options = {
    headers: {
      cookie: `jwt=${process.env.AUTH_TOKEN}`
    }
  }
  const status = await frontendStatus(datasetsToTest[2],baseUrlTesting,pkgStoreTestingUrl,newLine,options)
  t.is(status.name, 'finance-vix-private')
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

test.serial('finance-vix-private does not work when logged out on testing', async t => {
  let response = await fetch(`${baseUrlTesting}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}`)
  t.is(response.status, 404)
  response = await fetch(`${baseUrlTesting}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}/datapackage.json`)
  t.is(response.status, 404)
  response = await fetch(`${baseUrlTesting}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}/r/vix_daily.csv`)
  t.is(response.status, 404)
  response = await fetch(`${baseUrlTesting}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}/r/vix_daily.json`)
  t.is(response.status, 404)
  response = await fetch(`${baseUrlTesting}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}/r/datapackage_zip.zip`)
  t.is(response.status, 404)
})

test.serial('finance-vix-private does not work when logged in but not owner on testing', async t => {
  const options = {
    headers: {
      cookie: `jwt=test`
    }
  }
  let response = await fetch(`${baseUrlTesting}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}`, options)
  t.is(response.status, 404)
  response = await fetch(`${baseUrlTesting}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}/datapackage.json`, options)
  t.is(response.status, 404)
  response = await fetch(`${baseUrlTesting}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}/r/vix_daily.csv`, options)
  t.is(response.status, 404)
  response = await fetch(`${baseUrlTesting}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}/r/vix_daily.json`, options)
  t.is(response.status, 404)
  response = await fetch(`${baseUrlTesting}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}/r/datapackage_zip.zip`, options)
  t.is(response.status, 404)
})

test.serial('finance-vix-private works on production', async t => {
  const options = {
    headers: {
      cookie: `jwt=${process.env.AUTH_TOKEN}`
    }
  }
  const status = await frontendStatus(datasetsToTest[2],baseUrl,pkgStoreUrl,newLine,options)
  t.is(status.name, 'finance-vix-private')
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
test.serial('finance-vix-private does not work when logged out on production', async t => {
  let response = await fetch(`${baseUrl}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}`)
  t.is(response.status, 404)
  response = await fetch(`${baseUrl}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}/datapackage.json`)
  t.is(response.status, 404)
  response = await fetch(`${baseUrl}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}/r/vix_daily.csv`)
  t.is(response.status, 404)
  response = await fetch(`${baseUrl}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}/r/vix_daily.json`)
  t.is(response.status, 404)
  response = await fetch(`${baseUrl}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}/r/datapackage_zip.zip`)
  t.is(response.status, 404)
})

test.serial('finance-vix-private does not work when logged in but not owner on production', async t => {
  const options = {
    headers: {
      cookie: `jwt=test`
    }
  }
  let response = await fetch(`${baseUrl}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}`, options)
  t.is(response.status, 404)
  response = await fetch(`${baseUrl}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}/datapackage.json`, options)
  t.is(response.status, 404)
  response = await fetch(`${baseUrl}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}/r/vix_daily.csv`, options)
  t.is(response.status, 404)
  response = await fetch(`${baseUrl}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}/r/vix_daily.json`, options)
  t.is(response.status, 404)
  response = await fetch(`${baseUrl}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}/r/datapackage_zip.zip`, options)
  t.is(response.status, 404)
})