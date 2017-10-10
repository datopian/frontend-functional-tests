require('dotenv').config()
const fs = require('fs')
const lodash = require('lodash')
const data = require('data.js')
const toArray = require('stream-to-array')
const json2csv = require('json2csv')
const fetch = require('node-fetch')

class CheckWebsite {
  constructor(rows) {
    // TODO: File.rows should do this for us ...
    this.headers = rows.shift()
    this.statuses = rows.map(row => {
      return lodash.zipObject(this.headers, row)
    })
  }

  static async load(statusCsvPath) {
    const res = data.File.load(statusCsvPath)
    let rows = await res.rows()
    rows = await toArray(rows)
    return new CheckWebsite(rows)
  }

 
  async check(path_) {
    for (const statusObj of this.statuses) {
      const responsePage = await pageInfo()
      if (responsePage.status === 200) {
        statusObj.page_status = responsePage.status + ': ' + responsePage.statusText
        let title = 'VIX - CBOE Volatility Index'
        let body = await responsePage.text()
        if (body.includes(title)) {
          statusObj.dataset_title = 'OK'
        } else {
          statusObj.dataset_title = 'NOT OK'
        }
        if (body.includes('Read me')) {
          statusObj.readme = 'OK'
        } else {
          statusObj.readme = 'NOT OK'
        }
      } else {
        statusObj.page_status = responsePage.status + ': ' + responsePage.statusText
        statusObj.dataset_title = 'NOT OK'
        statusObj.readme = 'NOT OK'
      }
      
      const responseCsv = await csvLinks()
      statusObj.csv_links = responseCsv.status + ': ' + responseCsv.statusText
    
      const responseJson = await jsonLinks()
      statusObj.json_links = responseJson.status + ': ' + responseJson.statusText
      
      const responseDatapackage = await datapackageJson()
      if (responseDatapackage.status === 200) {
        statusObj.datapackage_json = responseDatapackage.status + ': ' + responseDatapackage.statusText
        let body = await responseDatapackage.text()
        body = JSON.parse(body)
        if ((body.resources).length === 4) {
          statusObj.resources = 'OK'
        } else {
          statusObj.resources = 'resources missing'
        }
      }
      
      const responsePreviewLinks = await csvPreviewLinks()
      statusObj.csv_preview_links = responsePreviewLinks.status + ': ' + responsePreviewLinks.statusText
    }
    this.save(path_)
  }
  
  save(path_ = process.argv[3]) {
    const fields = ['page_status','total_load_time','first_byte_load_time','html_load_time','data_load_time','page_title','dataset_title','readme','resources','download_links','csv_links','csv_preview_links','json_links','zip_links','zip_content','datapackage_json','tables','graphs']
    const csv = json2csv({
      data: this.statuses,
      fields
    })
    fs.writeFile(path_, csv, err => {
      if (err) {
        console.log(err)
      }
    })
  }
}

(async () => {
  const tools = await CheckWebsite.load(process.argv[3])
  if (process.argv[2] === 'check') {
    await tools.check()
  }
})()



const csvPreviewLinks = async () => {
  const dpUrl = `https://pkgstore.datahub.io/core/finance-vix/latest/datapackage.json`
  const res = await fetch(dpUrl)
  let body = await res.text()
  body = JSON.parse(body)
  for (const idx in body.resources) {
    const resource = body.resources[idx]
    if (resource.datahub.type === 'derived/preview') {
      const previewUrl = resource.path
      const resPreview = await fetch(previewUrl)
      return resPreview
    } 
  }
}
const csvLinks = async () => {
  const url = 'https://datahub.io/core/finance-vix/r/vix-daily.csv'
  const res = await fetch(url)
  return res
}
const jsonLinks = async () => {
  const url = `http://datahub.io/core/finance-vix/r/vix-daily.json`
  const res = await fetch(url)
  return res
}
const pageInfo = async () => {
  const url = 'http://datahub.io/core/finance-vix'
  const res = await fetch(url)
  return res
}

const datapackageJson = async () => {
  const url = 'https://pkgstore.datahub.io/core/finance-vix/latest/datapackage.json'
  const res = await fetch(url)
  return res
}

module.exports.CheckWebsite = CheckWebsite
