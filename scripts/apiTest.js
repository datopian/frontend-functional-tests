require('dotenv').config()
const fetch = require('node-fetch')


// specstore API upload
const specstoreApiUpload = async (url) => {
  const res = await fetch(url, {
    headers: {'Auth-Token': 'invalid-token'},
    method: "POST",
    body: JSON.stringify({a: 1, b: 2})
  })
  let body = await res.text()
  body = JSON.parse(body)
  return body
}

// specstore API status
const apiStatus = async (url) => {
  const res = await fetch(url)
  let body = await res.text()
  body = JSON.parse(body)
  return body
}

// specstore API upload
const apiAuthChangeUsername = async (url) => {
  const res = await fetch(url, {
    method: "POST",
  })
  let body = await res.text()
  body = JSON.parse(body)
  return body
}

const apiAuthPublicKey = async (url) => {
  const res = await fetch(url)
  let body = await res.text()
  return body
}

const apiMetastoreSearch = async (url) => {
  const res = await fetch(url, {
    headers: {'Auth-Token': process.env.AUTH_TOKEN}
  })
  let body = await res.text()
  return body
}

// bistore API(rawstore)
const apiBitstoreAuthorize = async (url) => {
  const res = await fetch(url, {
    headers: {'Auth-Token': 'test'},
    method: "POST",
    body: JSON.stringify({a: 1, b: 2})
  })
  return res
}

const apiBitstoreInfoValidToken = async (url) => {
  const res = await fetch(url, {
    headers: {'Auth-Token': process.env.AUTH_TOKEN_PERMISSION}
  })
  return res
}

const apiBitstoreInfoInvalidToken = async (url) => {
  const res = await fetch(url, {
    headers: {'Auth-Token': 'invalid-token'}
  })
  return res
}

module.exports = {
  apiStatus,
  apiAuthChangeUsername,
  specstoreApiUpload,
  apiAuthPublicKey,
  apiMetastoreSearch,
  apiBitstoreAuthorize,
  apiBitstoreInfoValidToken,
  apiBitstoreInfoInvalidToken
}