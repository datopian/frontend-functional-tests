Functional testing for frontend

## Usage

* To run the tests, use the following command
```
npm run check
```

* All results will be saved in `status.csv` with the following headers: 
`id` - timestamp
`name` - dataset name
`page_status` - status code and description
`page_title` - page title
`dataset_title` - dataset title
`readme` - contains readme: OK|NOT OK
`csv_links` - status code and description
`csv_preview_links` - status code and description
`json_links` - status code and description
`zip_links` - status code and description
`datapackage_json` - status code and description
`total_load_time` - total loading time
`script_laod_time` - script loading time
`layout_load_time` - layouts loading time
`tables` - contains table: OK|NOT OK
`graphs` - contains graphs: OK|NOT OK

* If you want to add datasets to test, add dataset into dictionary in `index.js`

```
[
  {
    "owner": "core",
    "name": "finance-vix"
  },
  {
    "owner": "core",
    "name": "gdp-uk"
  }
]
```


