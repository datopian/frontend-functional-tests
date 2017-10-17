Functional testing for frontend

## Usage

To run the tests, use the following command
```
node index.js
```

All results will be saved in `status.csv` with the following headers:
`id,name,page_status,page_title,dataset_title,readme,csv_links,csv_preview_links,json_links,zip_links,datapackage_json,total_load_time,script_laod_time,layout_load_time,tables,graphs`

If you want to add datasets to test, add dataset into dictionary in `index.js`

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


