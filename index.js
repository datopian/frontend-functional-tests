const fs = require('fs')

const json2csv = require('json2csv')
const cheerio = require('cheerio')
const fetch = require('node-fetch')

var newLine= "\r\n"
const datasetsToTest = [
  {
    "owner": "core",
    "name": "finance-vix"
  },
  {
    "owner": "core",
    "name": "gdp"
  }
]

const baseUrl = 'https://datahub.io'

const checkPage = async (url) => {
  const info = {}
  const res = await fetch(url)
  let body = await res.text()
  info.status = res.status
  info.htmlBody = body
  return info
}

const datapackageJson = async (url) => {
  const res = await fetch(url)
  let body = await res.text()
  body = JSON.parse(body)
  return body
}

const resourceLinks = async (url) => {
  const res = await fetch(url)
  return res
}

const writeToCSV = async (fields, toCsv) => {
  var csv = json2csv(toCsv) + newLine;

  await fs.appendFile('status.csv', csv, err => {
      if (err) {
        console.log(err)
      }
      console.log('The data appended to file!');
  });
}

//checkShowcase page returns 200 and get html content
datasetsToTest.forEach(async dataset => {
  const statuses = {}
  const date = new Date()
  statuses.id = date.toISOString()
  statuses.name = dataset.name
  const showcaseUrl = `https://datahub.io/${dataset.owner}/${dataset.name}`
  
  // page status 
  const page = await checkPage(showcaseUrl) //returns {status: statusCode, body: htmlBody}
  statuses.page_status = page.status
  if (page.status !== 200) {
    // exit
  } else {
    const $ = cheerio.load(page.htmlBody)
    let datackageUrl = `https://pkgstore.datahub.io/${dataset.owner}/${dataset.name}/latest/datapackage.json`
    const dp = await datapackageJson(datackageUrl)
    
    // page title
    let pageTitle = $('head').find('title').text()
    if (pageTitle.includes(dp.title)) {
      statuses.page_title = 'OK'
    } else {
      statuses.page_title = 'NOT OK'
    }
    
    //dataset title
    let datasetTitle = $('.showcase-page-header').find('h1').text()
    if (datasetTitle.includes(dp.title)) {
      statuses.dataset_title = 'OK'
    } else {
      statuses.dataset_title = 'NOT OK'
    }
    
    // readme
    let readme = $('.inner_container').find('#readme').text()
    if (readme === 'Read me') {
      statuses.readme = 'OK'
    } else {
      statuses.readme = 'NOT OK'
    }
    
    // resources link
    const resourcesLink = $('.resource-listing').find('a')
    for (let i = 0; i < resourcesLink.length; i++) {
      if (resourcesLink[i].attribs.href.startsWith('/')) {
        switch(resourcesLink[i].attribs.href.substr(resourcesLink[i].attribs.href.lastIndexOf('.') + 1)) {
          case 'csv':
            let csvLinks = baseUrl + resourcesLink[i].attribs.href
            const csvUrl = await resourceLinks(csvLinks)
            statuses.csv_links = csvUrl.status + ':' + csvUrl.statusText
            break;
          case 'json':
            let jsonLinks = baseUrl + resourcesLink[i].attribs.href
            const jsonUrl = await resourceLinks(jsonLinks)
            statuses.json_links = jsonUrl.status + ':' + jsonUrl.statusText
            break;
          case 'zip':
            let zipLinks = baseUrl + resourcesLink[i].attribs.href
            const zipUrl = await resourceLinks(zipLinks)
            statuses.zip_links = zipUrl.status + ':' + zipUrl.statusText
            break;
        }
      }
    }
    
    // csv_preview_links
    for (const idx in dp.resources) {
      const resource = dp.resources[idx]
      if (resource.datahub.type === 'derived/preview') {
        const previewUrl = resource.path
        const resPreview = await fetch(previewUrl)
        statuses.csv_preview_links = resPreview.status + ': ' + resPreview.statusText
      } 
    }
    
    // datapackage_json
    const datapackageLink = $('.container').find('.btn-default')
    if ( datapackageLink.text() === 'Datapackage.json') {
      let datapackageUrl = baseUrl + datapackageLink[0].attribs.href
      const dpUrl = await resourceLinks(datapackageUrl)
      statuses.datapackage_json = dpUrl.status + ':' + dpUrl.statusText
    }
  }
  
  // append row into csv file
  let fields = ["id","name","page_status","page_title","dataset_title","readme","csv_links","csv_preview_links","json_links","zip_links","datapackage_json","total_load_time","first_byte_load_time","html_load_time","data_load_time","zip_content","tables","graphs"]
  var toCsv = {
      data: statuses,
      fields: fields,
      hasCSVColumnTitle: false
  }
  const appentToStatus = await writeToCSV(fields, toCsv)
})