require('dotenv').config()

const test = require('ava')

const {apiStatus, specstoreApiUpload, apiAuthChangeUsername, apiAuthPublicKey, apiStatusWithHeaders, apiBitstoreAuthorize, apiBitstoreInfoValidToken, apiBitstoreInfoInvalidToken} = require('../scripts/api.js')


const SPECSTORE = process.env.SPECSTORE
const OWNERID = process.env.OWNERID
const API_DATASET = 'test-data-package-for-api-test'

test('specstore info for latest revision works fine', async t => {
  const url = `${SPECSTORE}/${OWNERID}/${API_DATASET}/latest`
  const body = await apiStatus(url)
  t.is(body.spec_contents.meta.dataset, `${API_DATASET}`)
  t.is(body.state, 'SUCCEEDED')
})
test('specstore status works fine', async t => {
  const urlLatest = `${SPECSTORE}/${OWNERID}/${API_DATASET}/latest`
  let body = await apiStatus(urlLatest)
  const revisionId = body.id.split('/').pop()
  const urlRevision = `${SPECSTORE}/${OWNERID}/${API_DATASET}/${revisionId}`
  body = await apiStatus(urlRevision)
  t.is(body.state,'SUCCEEDED')
})
test('specstore info for successful revision works fine', async t => {
  const url = `${SPECSTORE}/${OWNERID}/${API_DATASET}/successful`
  const body = await apiStatus(url)
  t.is(body.spec_contents.meta.dataset, `${API_DATASET}`)
  t.is(body.state, 'SUCCEEDED')
})
test('specstore upload works fine', async t => {
  const url = `${SPECSTORE}/upload`
  const body = await specstoreApiUpload(url)
  t.is(body.success, false)
})

test('auth permission for a service', async t => {
  const url = `http://api.datahub.io/auth/authorize?jwt=${process.env.AUTH_TOKEN}&service=test`
  const body = await apiStatus(url)
  t.is(body.service, 'test')
})
test('auth check an authentication token validity with valid token', async t => {
  const url = `https://api.datahub.io/auth/check?next=test`
  let body = await apiStatusWithHeaders(url)
  body = JSON.parse(body)
  t.is(body.authenticated, true)
})
test('auth change the username', async t => {
  const url = `http://api.datahub.io/auth/update?jwt=test1&username=test1`
  const body = await apiAuthChangeUsername(url)
  t.is(body.success, false)
})
test('auth receive authorization public key', async t => {
  const url = `http://api.datahub.io/auth/public-key`
  const body = await apiAuthPublicKey(url)
  t.true(body.includes('BEGIN PUBLIC KEY'))
})

test('metastore search', async t => {
  const url = `http://api.datahub.io/metastore/search?datahub.ownerid="${OWNERID}"`
  const body = await apiStatusWithHeaders(url)
  t.true(body.includes(`"owner": "examples"`))
})
test('metastore search events', async t => {
  const url = `http://api.datahub.io/metastore/search/events`
  const body = await apiStatusWithHeaders(url)
  t.true(body.includes(`"dataset": "redirection-test-dataset"`))
})

test('resolver username to userid', async t => {
  const url = `http://api.datahub.io/resolver/resolve?path=examples/vega-airports`
  const body = await apiStatusWithHeaders(url)
  t.true(body.includes(`"userid": "examples"`))
})

test('bitstore(rawstore) get authorized upload URL', async t => {
  const url = `http://api.datahub.io/rawstore/authorize`
  const res = await apiBitstoreAuthorize(url)
  t.is(res.statusText, 'BAD REQUEST')
  t.is(res.status, 400)
})
test('bitstore(rawstore) get information regarding the datastore with invalid token', async t => {
  const url = `http://api.datahub.io/rawstore/info`
  const res = await apiBitstoreInfoInvalidToken(url)
  t.is(res.statusText, 'UNAUTHORIZED')
  t.is(res.status, 401)
})
test('bitstore(rawstore) get information regarding the datastore with valid token', async t => {
  const url = `http://api.datahub.io/rawstore/info`
  const res = await apiBitstoreInfoValidToken(url)
  t.is(res.statusText, 'OK')
  t.is(res.status, 200)
})