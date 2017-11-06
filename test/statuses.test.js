const test = require('ava')

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
  }
]

const baseUrl = 'https://datahub.io'
const pkgStoreUrl = 'https://pkgstore.datahub.io'
const baseUrlTesting = 'https://testing.datahub.io'
const pkgStoreTestingUrl = 'https://pkgstore-testing.datahub.io'


test('finance-vix works on production', async t => {
  const status = await frontendStatus(datasetsToTest[0],baseUrl,pkgStoreUrl,newLine)
  t.is(status.name, 'finance-vix')
  t.is(status.page_status, '200:OK')
  t.is(status.page_title, 'OK')
  t.is(status.dataset_title, 'OK')
  t.is(status.readme, 'OK')
  t.is(status.csv_links, '200:OK')
  t.is(status.csv_preview_links, '200:OK')
  t.is(status.json_links, '200:OK')
  t.is(status.zip_links, '200:OK')
  t.is(status.datapackage_json, '200:OK')
  t.is(status.tables, 'OK')
  t.is(status.graphs, 'OK')
})

test('gdp-uk works on production', async t => {
  const status = await frontendStatus(datasetsToTest[1],baseUrl,pkgStoreUrl,newLine)
  t.is(status.name, 'gdp-uk')
  t.is(status.page_status, '200:OK')
  t.is(status.page_title, 'OK')
  t.is(status.dataset_title, 'OK')
  t.is(status.readme, 'OK')
  t.is(status.csv_links, '200:OK')
  t.is(status.csv_preview_links, 'NOT GENERATED')
  t.is(status.json_links, '200:OK')
  t.is(status.zip_links, '200:OK')
  t.is(status.datapackage_json, '200:OK')
  t.is(status.tables, 'OK')
  t.is(status.graphs, 'OK')
})
test('finance-vix works on testing', async t => {
  const status = await frontendStatus(datasetsToTest[0],baseUrlTesting,pkgStoreTestingUrl,newLine)
  t.is(status.name, 'finance-vix')
  t.is(status.page_status, '200:OK')
  t.is(status.page_title, 'OK')
  t.is(status.dataset_title, 'OK')
  t.is(status.readme, 'OK')
  t.is(status.csv_links, '200:OK')
  t.is(status.csv_preview_links, '200:OK')
  t.is(status.json_links, '200:OK')
  t.is(status.zip_links, '200:OK')
  t.is(status.datapackage_json, '200:OK')
  t.is(status.tables, 'OK')
  t.is(status.graphs, 'OK')
})

test('gdp-uk works on testing', async t => {
  const status = await frontendStatus(datasetsToTest[1],baseUrlTesting,pkgStoreTestingUrl,newLine)
  t.is(status.name, 'gdp-uk')
  t.is(status.page_status, '200:OK')
  t.is(status.page_title, 'OK')
  t.is(status.dataset_title, 'OK')
  t.is(status.readme, 'OK')
  t.is(status.csv_links, '200:OK')
  t.is(status.csv_preview_links, 'NOT GENERATED')
  t.is(status.json_links, '200:OK')
  t.is(status.zip_links, '200:OK')
  t.is(status.datapackage_json, '200:OK')
  t.is(status.tables, 'OK')
  t.is(status.graphs, 'OK')
})
