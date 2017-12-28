'use strict'

const expect = require('chai').expect
require('dotenv').config()
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
    "owner": "examples",
    "name": "redirection-test-dataset"
  }
]

describe('testing public dataset, in our case finance-vix', function () {
  it(`finance-vix works on ${DOMAIN}`, async function () {
    this.timeout(180000)
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
})

describe('testing private dataset, in our case finance-vix', function () {
  it(`finance-vix-private works on ${DOMAIN}`, async function () {
    this.timeout(1800000)
    const options = {
      headers: {
        cookie: `jwt=${process.env.AUTH_TOKEN}`
      }
    }
    const status = await frontendStatus(datasetsToTest[1],DOMAIN,newLine,options)
    expect(status.name, `${datasetsToTest[1].name}`)
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
  it(`finance-vix-private does not work when logged out on ${DOMAIN}`, async function () {
    this.timeout(30000)
    let response = await fetch(`${DOMAIN}/${datasetsToTest[1].owner}/${datasetsToTest[1].name}`)
    expect(response.status).to.equal(404)
    response = await fetch(`${DOMAIN}/${datasetsToTest[1].owner}/${datasetsToTest[1].name}/datapackage.json`)
    expect(response.status).to.equal(404)
    response = await fetch(`${DOMAIN}/${datasetsToTest[1].owner}/${datasetsToTest[1].name}/r/vix_daily.csv`)
    expect(response.status).to.equal(404)
    response = await fetch(`${DOMAIN}/${datasetsToTest[1].owner}/${datasetsToTest[1].name}/r/vix_daily.json`)
    expect(response.status).to.equal(404)
    response = await fetch(`${DOMAIN}/${datasetsToTest[1].owner}/${datasetsToTest[1].name}/r/datapackage_zip.zip`)
    expect(response.status).to.equal(404)
  })
  it(`finance-vix-private does not work when logged in but not owner on ${DOMAIN}`, async function () {
    this.timeout(30000)
    const options = {
      headers: {
        cookie: `jwt=test`
      }
    }
    let response = await fetch(`${DOMAIN}/${datasetsToTest[1].owner}/${datasetsToTest[1].name}`, options)
    expect(response.status).to.equal(404)
    response = await fetch(`${DOMAIN}/${datasetsToTest[1].owner}/${datasetsToTest[1].name}/datapackage.json`, options)
    expect(response.status).to.equal(404)
    response = await fetch(`${DOMAIN}/${datasetsToTest[1].owner}/${datasetsToTest[1].name}/r/vix_daily.csv`, options)
    expect(response.status).to.equal(404)
    response = await fetch(`${DOMAIN}/${datasetsToTest[1].owner}/${datasetsToTest[1].name}/r/vix_daily.json`, options)
    expect(response.status).to.equal(404)
    response = await fetch(`${DOMAIN}/${datasetsToTest[1].owner}/${datasetsToTest[1].name}/r/datapackage_zip.zip`, options)
    expect(response.status).to.equal(404)
  })
})