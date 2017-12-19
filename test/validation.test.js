'use strict'

require('dotenv').config()

const expect = require('chai').expect;
const {apiStatus} = require('../scripts/api.js')
const {frontendStatus} = require('../scripts/index.js')

let newLine= "\r\n"


const datasetsToTest = [
  {
    "owner": "examples",
    "name": "redirection-test-dataset"
  }
]


describe('dataset validation in frontend', function () {
  it('redirection test for specstore', async function () {
    const urlLatest = `${process.env.SPECSTORE}/${process.env.OWNERID}/${process.env.REDIRECTION_DATASET}/latest`
    let body = await apiStatus(urlLatest)
    const revisionId = body.id.split('/').pop()
    const urlRevision = `${process.env.SPECSTORE}/${process.env.OWNERID}/${process.env.REDIRECTION_DATASET}/${revisionId}`
    body = await apiStatus(urlRevision)
    expect(body.spec_contents.meta.dataset).to.equal('redirection-test-dataset')
    expect(body.state).to.equal('SUCCEEDED')
  })
  it('redirection works on production', async function () {
    this.timeout(120000);
    const status = await frontendStatus(datasetsToTest[0],process.env.DOMAIN,newLine)
    expect(status.name).to.equal('redirection-test-dataset')
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
})