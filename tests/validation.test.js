'use strict'

require('dotenv').config()

const test = require('ava')


const {apiStatus} = require('../scripts/api.js')
const {frontendStatus} = require('../scripts/index.js')

let newLine= "\r\n"


const datasetsToTest = [
  {
    "owner": "examples",
    "name": "redirection-test-dataset"
  }
]


test('redirection test for specstore', async t => {
  const urlLatest = `${process.env.SPECSTORE}/${process.env.OWNERID}/${process.env.REDIRECTION_DATASET}/latest`
  let body = await apiStatus(urlLatest)
  const revisionId = body.id.split('/').pop()
  const urlRevision = `${process.env.SPECSTORE}/${process.env.OWNERID}/${process.env.REDIRECTION_DATASET}/${revisionId}`
  body = await apiStatus(urlRevision)
  t.is(body.spec_contents.meta.dataset, 'redirection-test-dataset')
  t.is(body.state, 'SUCCEEDED')
})

test('redirection works on production', async t => {
  const status = await frontendStatus(datasetsToTest[0],process.env.DOMAIN,newLine)
  t.is(status.name, 'redirection-test-dataset')
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