'use strict'

const expect = require('chai').expect;
require('dotenv').config()
const {apiStatus, specstoreApiUpload, apiAuthChangeUsername, apiAuthPublicKey, apiStatusWithHeaders, apiBitstoreAuthorize, apiBitstoreInfoValidToken, apiBitstoreInfoInvalidToken} = require('../scripts/api.js')


const SPECSTORE = process.env.SPECSTORE
const OWNERID = process.env.OWNERID
const API_DATASET = 'test-data-package-for-api-test'

describe('specstore service api', function () {
  it('specstore info for latest revision works fine', async function () {
    this.timeout(120000);
    const url = `${SPECSTORE}/${OWNERID}/${API_DATASET}/latest`
    const body = await apiStatus(url)
    expect(body.spec_contents.meta.dataset).to.equal(`${API_DATASET}`)
    expect(body.state).to.equal('SUCCEEDED')
  })
  it('specstore status works fine', async function () {
    const urlLatest = `${SPECSTORE}/${OWNERID}/${API_DATASET}/latest`
    let body = await apiStatus(urlLatest)
    const revisionId = body.id.split('/').pop()
    const urlRevision = `${SPECSTORE}/${OWNERID}/${API_DATASET}/${revisionId}`
    body = await apiStatus(urlRevision)
    expect(body.state).to.equal('SUCCEEDED')
  })
  it('specstore info for successful revision works fine', async function () {
    const url = `${SPECSTORE}/${OWNERID}/${API_DATASET}/successful`
    const body = await apiStatus(url)
    expect(body.spec_contents.meta.dataset).to.equal(`${API_DATASET}`)
    expect(body.state).to.equal('SUCCEEDED')
  })
  it('specstore upload works fine', async function () {
    const url = `${SPECSTORE}/upload`
    const body = await specstoreApiUpload(url)
    expect(body.success).to.equal(false)
  })
})

describe('auth service api', function () {
  it('auth permission for a service', async function () {
    const url = `http://api.datahub.io/auth/authorize?jwt=${process.env.AUTH_TOKEN}&service=test`
    const body = await apiStatus(url)
    expect(body.service).to.equal('test')
  })
  it('auth check an authentication token validity with valid token', async function () {
    const url = `https://api.datahub.io/auth/check?next=test`
    let body = await apiStatusWithHeaders(url)
    body = JSON.parse(body)
    expect(body.authenticated).to.equal(true)
  })
  it('auth change the username', async function () {
    const url = `http://api.datahub.io/auth/update?jwt=test1&username=test1`
    const body = await apiAuthChangeUsername(url)
    expect(body.success).to.equal(false)
  })
  it('auth receive authorization public key', async function () {
    const url = `http://api.datahub.io/auth/public-key`
    const body = await apiAuthPublicKey(url)
    expect(body).to.include('BEGIN PUBLIC KEY')
  })
})

describe('metastore service api', function () {
  it('metastore search', async function () {
    const url = `http://api.datahub.io/metastore/search?datahub.ownerid="${OWNERID}"`
    const body = await apiStatusWithHeaders(url)
    expect(body).to.include(`"owner": "examples"`)
  })
  it('metastore search events', async function () {
    const url = `http://api.datahub.io/metastore/search/events`
    const body = await apiStatusWithHeaders(url)
    expect(body).to.include(`"dataset": "finance-vix"`)
  })
})

describe('resolver service api', function () {
  it('resolver username to userid', async function () {
    const url = `http://api.datahub.io/resolver/resolve?path=examples/vega-airports`
    const body = await apiStatusWithHeaders(url)
    expect(body).to.include(`"userid": "examples"`)
  })
})

describe('bitstore service api', function () {
  it('bitstore(rawstore) get authorized upload URL', async function () {
    const url = `http://api.datahub.io/rawstore/authorize`
    const res = await apiBitstoreAuthorize(url)
    expect(res.statusText).to.equal('BAD REQUEST')
    expect(res.status).to.equal(400)
  })
  it('bitstore(rawstore) get information regarding the datastore with invalid token', async function () {
    const url = `http://api.datahub.io/rawstore/info`
    const res = await apiBitstoreInfoInvalidToken(url)
    expect(res.statusText).to.equal('UNAUTHORIZED')
    expect(res.status).to.equal(401)
  })
  it('bitstore(rawstore) get information regarding the datastore with valid token', async function () {
    const url = `http://api.datahub.io/rawstore/info`
    const res = await apiBitstoreInfoValidToken(url)
    expect(res.statusText).to.equal('OK')
    expect(res.status).to.equal(200)
  })
})
