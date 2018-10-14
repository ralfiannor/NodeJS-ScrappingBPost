# Command to install and Run :
- npm install
- node server
- run at port 8081

# Documentation : 

## POST /bpost
"Get list of news"

Body: district | string | required

Example: 
```
{
    "district": "tanah-bumbu" 
}
```
## POST /bpost/content
"Get content detail"

Body: url | string | required

Example: 
```
{
    "url": "http://banjarmasin.tribunnews.com/2018/10/09/dua-hari-menjabat-bupati-tanbu-sudian-noor-langsung-melantik-53-pejabat" 
}
```
