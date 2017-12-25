'use strict'

require('dotenv').config()

const expect = require('chai').expect;
const {apiStatus} = require('../scripts/api.js')
const {frontendStatus} = require('../scripts/index.js')

let newLine= "\r\n"

const DOMAIN = process.env.DOMAIN
const SPECSTORE = process.env.SPECSTORE
const OWNERID = process.env.OWNERID
const datasetsToTest = [
  {
    "owner": "examples",
    "name": "redirection-test-dataset"
  },
  {
    "owner": "examples",
    "name": "small-dataset-for-testing-validation"
  },
  {
    "owner": "examples",
    "name": "big-dataset-for-testing-frontend-validation"
  },
  {
    "owner": "examples",
    "name": "processing-dataset"
  }
]


describe('dataset validation in frontend', function () {
  it('redirection test for specstore', async function () {
    this.timeout(600000)
    const urlLatest = `${SPECSTORE}/${OWNERID}/${datasetsToTest[0].name}/latest`
    let body = await apiStatus(urlLatest)
    const revisionId = body.id.split('/').pop()
    const revisionUrl = `${SPECSTORE}/${OWNERID}/${datasetsToTest[0].name}/${revisionId}`
    body = await apiStatus(revisionUrl)
    expect(body.spec_contents.meta.dataset).to.equal(`${datasetsToTest[0].name}`)
    
    expect(body.state).to.equal('SUCCEEDED')
  })
  it(`redirection works on ${DOMAIN}`, async function () {
    this.timeout(1800000)
    const status = await frontendStatus(datasetsToTest[0],DOMAIN,newLine)
    expect(status.name).to.equal(`${datasetsToTest[0].name}`)
    expect(status.page_status).to.equal('200:OK')
    expect(status.page_title).to.equal('OK')
    expect(status.dataset_title).to.equal('OK')
    expect(status.readme).to.equal('OK')
    expect(status.csv_links).to.equal('200:OK')
    expect(status.json_links).to.equal('200:OK')
    expect(status.zip_links).to.equal('200:OK')
    expect(status.datapackage_json).to.equal('200:OK')
    expect(status.tables).to.equal('OK')
    expect(status.graphs).to.equal('OK')
  })
  it(`small invalid dataset with duplicated row on ${SPECSTORE}`, async function () {
    this.timeout(600000)
    const urlLatest = `${SPECSTORE}/${OWNERID}/${datasetsToTest[1].name}/latest`
    let body = await apiStatus(urlLatest)
    const revisionId = body.id.split('/').pop()
    const revisionUrl = `${SPECSTORE}/${OWNERID}/${datasetsToTest[1].name}/${revisionId}`
    body = await apiStatus(revisionUrl)
    expect(body.spec_contents.meta.dataset).to.equal(`${datasetsToTest[1].name}`)
    expect(body.state).to.equal('FAILED')
  })
  it(`small invalid dataset with duplicated row on ${DOMAIN}`, async function () {
    this.timeout(1800000)
    const status = await frontendStatus(datasetsToTest[1],DOMAIN,newLine)
    expect(status.name).to.equal(`${datasetsToTest[1].name}`)
    expect(status.page_status).to.equal('200:OK')
    expect(status.page_title).to.equal('OK')
    expect(status.dataset_title).to.equal('OK')
    expect(status.readme).to.equal('OK')
    expect(status.csv_links).to.equal('200:OK')
    expect(status.json_links).to.equal('200:OK')
    expect(status.zip_links).to.equal('200:OK')
    expect(status.datapackage_json).to.equal('200:OK')
    expect(status.tables).to.equal('OK')
    expect(status.graphs).to.equal('OK')
    expect(status.validation_status).to.equal('OK')
    expect(status.goodtables_report).to.equal('OK')
  })
  it(`big invalid dataset on ${SPECSTORE}`, async function () {
    this.timeout(600000)
    const urlLatest = `${SPECSTORE}/${OWNERID}/${datasetsToTest[2].name}/latest`
    let body = await apiStatus(urlLatest)
    const revisionId = body.id.split('/').pop()
    const revisionUrl = `${SPECSTORE}/${OWNERID}/${datasetsToTest[2].name}/${revisionId}`
    body = await apiStatus(revisionUrl)
    expect(body.spec_contents.meta.dataset).to.equal(`${datasetsToTest[2].name}`)
    expect(body.state).to.equal('FAILED')
  })
  it(`big invalid dataset on latest ${DOMAIN}`, async function () {
    this.timeout(1800000)
    const status = await frontendStatus(datasetsToTest[2],DOMAIN,newLine)
    expect(status.name).to.equal(`${datasetsToTest[2].name}`)
    expect(status.page_status).to.equal('404:Not Found')
  })
  it.only(`big invalid dataset on revision ${DOMAIN}`, async function () {
    this.timeout(1800000)
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
    expect(status.name).to.equal(`${datasetsToTest[2].name}`)
    expect(status.page_status).to.equal('200:OK')
    expect(status.readme).to.equal('OK')
    expect(status.datapackage_json).to.equal('404:Not Found')
    expect(status.tables).to.equal('NOT OK')
    expect(status.graphs).to.equal('NOT OK')
    expect(status.validation_status).to.equal('OK')
    expect(status.goodtables_report).to.equal('OK')
  })
  it(`processing dataset on ${SPECSTORE}`, async function () {
    this.timeout(600000)
    const urlLatest = `${SPECSTORE}/${OWNERID}/${datasetsToTest[3].name}/latest`
    let body = await apiStatus(urlLatest)
    const revisionId = body.id.split('/').pop()
    const revisionUrl = `${SPECSTORE}/${OWNERID}/${datasetsToTest[3].name}/${revisionId}`
    body = await apiStatus(revisionUrl)
    expect(body.spec_contents.meta.dataset).to.equal(`${datasetsToTest[3].name}`)
    expect(body.state).to.equal('FAILED')
  })
  it(`processing dataset on latest ${DOMAIN}`, async function () {
    this.timeout(1800000)
    const status = await frontendStatus(datasetsToTest[3],DOMAIN,newLine)
    expect(status.name).to.equal(`${datasetsToTest[3].name}`)
    expect(status.page_status).to.equal('404:Not Found')
  })
  it(`processing dataset on revision ${DOMAIN}`, async function () {
    this.timeout(1800000)
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
    expect(status.name).to.equal(`${datasetsToTest[3].name}`)
    expect(status.page_status).to.equal('200:OK')
    expect(status.readme).to.equal('OK')
    expect(status.datapackage_json).to.equal('404:Not Found')
    expect(status.tables).to.equal('NOT OK')
    expect(status.graphs).to.equal('NOT OK')
    expect(status.validation_status).to.equal('OK')
    expect(status.goodtables_report).to.equal('OK')
  })
})