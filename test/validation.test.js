require('dotenv').config()

const test = require('ava')

const {apiStatus} = require('../scripts/api.js')
const {frontendStatus} = require('../scripts/index.js')

let newLine= "\r\n"

const DOMAIN = process.env.DOMAIN
const SPECSTORE = process.env.SPECSTORE
const OWNERID = process.env.OWNERID
const datasetsToTest = [
  {
    "owner": "test",
    "name": "redirection-test-dataset"
  },
  {
    "owner": "test",
    "name": "small-dataset-for-testing-validation"
  },
  {
    "owner": "test",
    "name": "big-dataset-for-testing-frontend-validation"
  },
  {
    "owner": "test",
    "name": "processing-dataset"
  }
]


test('redirection test for specstore', async t => {
  const urlLatest = `${SPECSTORE}/${OWNERID}/${datasetsToTest[0].name}/latest`
  let body = await apiStatus(urlLatest)
  const revisionId = body.id.split('/').pop()
  const revisionUrl = `${SPECSTORE}/${OWNERID}/${datasetsToTest[0].name}/${revisionId}`
  body = await apiStatus(revisionUrl)
  t.is(body.spec_contents.meta.dataset, `${datasetsToTest[0].name}`)
  t.is(body.state, 'SUCCEEDED')
})
test(`redirection works on ${DOMAIN}`, async t => {
  const options = {
    headers: {
      cookie: `jwt=${process.env.AUTH_TOKEN}`
    }
  }
  const status = await frontendStatus(datasetsToTest[0],DOMAIN,newLine,options)
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
test(`small invalid dataset with duplicated row on ${SPECSTORE}`, async t => {
  const urlLatest = `${SPECSTORE}/${OWNERID}/${datasetsToTest[1].name}/latest`
  let body = await apiStatus(urlLatest)
  const revisionId = body.id.split('/').pop()
  const revisionUrl = `${SPECSTORE}/${OWNERID}/${datasetsToTest[1].name}/${revisionId}`
  body = await apiStatus(revisionUrl)
  t.is(body.spec_contents.meta.dataset, `${datasetsToTest[1].name}`)
  t.is(body.state, 'FAILED')
})
test.skip(`small invalid dataset with duplicated row on ${DOMAIN}`, async t => {
  const status = await frontendStatus(datasetsToTest[1],DOMAIN,newLine)
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
  t.is(status.validation_status, 'OK')
  t.is(status.goodtables_report, 'OK')
})
test(`big invalid dataset on ${SPECSTORE}`, async t => {
  const urlLatest = `${SPECSTORE}/${OWNERID}/${datasetsToTest[2].name}/latest`
  let body = await apiStatus(urlLatest)
  const revisionId = body.id.split('/').pop()
  const revisionUrl = `${SPECSTORE}/${OWNERID}/${datasetsToTest[2].name}/${revisionId}`
  body = await apiStatus(revisionUrl)
  t.is(body.spec_contents.meta.dataset, `${datasetsToTest[2].name}`)
  t.is(body.state, 'FAILED')
})
test(`big invalid dataset on latest ${DOMAIN}`, async t => {
  const status = await frontendStatus(datasetsToTest[2],DOMAIN,newLine)
  t.is(status.name, `${datasetsToTest[2].name}`)
  t.is(status.page_status, '404:Not Found')
})
test(`big invalid dataset on revision ${DOMAIN}`, async t => {
  const urlLatest = `${SPECSTORE}/${OWNERID}/${datasetsToTest[2].name}/latest`
  let body = await apiStatus(urlLatest)
  const options = {
    headers: {
      cookie: `jwt=${process.env.AUTH_TOKEN}`
    }
  }
  const revisionId = body.id.split('/').pop()
  const revisionUrl = `${DOMAIN}/${datasetsToTest[2].owner}/${datasetsToTest[2].name}/v/${revisionId}`
  const status = await frontendStatus(datasetsToTest[2],DOMAIN,newLine,options,revisionUrl)
  t.is(status.name, `${datasetsToTest[2].name}`)
  t.is(status.page_status, '200:OK')
  t.is(status.readme, 'OK')
  t.is(status.tables, 'NOT OK')
  t.is(status.validation_status, 'OK')
  t.is(status.goodtables_report, 'OK')
})
test.skip(`processing dataset on ${SPECSTORE}`, async t => {
  const urlLatest = `${SPECSTORE}/${OWNERID}/${datasetsToTest[3].name}/latest`
  let body = await apiStatus(urlLatest)
  const revisionId = body.id.split('/').pop()
  const revisionUrl = `${SPECSTORE}/${OWNERID}/${datasetsToTest[3].name}/${revisionId}`
  body = await apiStatus(revisionUrl)
  t.is(body.spec_contents.meta.dataset, `${datasetsToTest[3].name}`)
  t.is(body.state, 'FAILED')
})
test.skip(`processing dataset on latest ${DOMAIN}`, async t => {
  const status = await frontendStatus(datasetsToTest[3],DOMAIN,newLine)
  t.is(status.name, `${datasetsToTest[3].name}`)
  t.is(status.page_status, '404:Not Found')
})
test.skip(`processing dataset on revision ${DOMAIN}`, async t => {
  const urlLatest = `${SPECSTORE}/${OWNERID}/${datasetsToTest[3].name}/latest`
  let body = await apiStatus(urlLatest)
  const options = {
    headers: {
      cookie: `jwt=${process.env.AUTH_TOKEN}`
    }
  }
  const revisionId = body.id.split('/').pop()
  const revisionUrl = `${DOMAIN}/${datasetsToTest[3].owner}/${datasetsToTest[3].name}/v/${revisionId}`
  const status = await frontendStatus(datasetsToTest[3],DOMAIN,newLine,options,revisionUrl)
  t.is(status.name, `${datasetsToTest[3].name}`)
  t.is(status.page_status, '200:OK')
  t.is(status.readme, 'OK')
  t.is(status.datapackage_json, '404:Not Found')
  t.is(status.tables, 'NOT OK')
  t.is(status.graphs, 'NOT OK')
  t.is(status.validation_status, 'OK')
  t.is(status.goodtables_report, 'OK')
})
