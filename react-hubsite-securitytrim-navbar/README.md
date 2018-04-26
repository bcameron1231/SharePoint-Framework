# react-hubsite-securitytrim-navbar

## Summary

Application Customizer which uses the SharePoint Search API and the new Hub site REST API to build out security trimmed navigation within hub sites. This application customizer will hide the default hub site navigation.

![The Hub Site Nav Bar](https://www.aerieconsulting.com/hs-fs/hubfs/HubNavSite.png?t=1522675516566&width=2924&height=1349&name=HubNavSite.png)

## Associated Blog Posts
http://www.aerieconsulting.com/blog/security-trimmed-hub-navigation
https://beaucameron.net/2018/04/17/security-trimmed-hub-site-navigation-updates/

## Solution

Solution|Author(s)
--------|---------
react-hubsite-securitytrim-navbar|Beau Cameron (MVP, [@Beau__Cameron](https://twitter.com/Beau__Cameron))

## Version history

Version|Date|Comments
-------|----|--------
1.0.0|April 1, 2018|Initial release
2.0.0|April 17, 2018|v2 Pre-release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Prerequisites

* Office 365 Developer tenant with a modern site collection w/ atleast one hub site enabled

## Build options

* clone this repo
* in the command line run
  * `npm i`
  * `gulp serve --nobrowser`
* open a modern site that exists within a hub site
* append the following query string parameters to the URL
* change "NavHeading" to be equal to the text of the root node. For example, "Sites"

```text
?loadSPFX=true&debugManifestsFile=https://localhost:4321/temp/manifests.js&customActions={"1859a5f8-d2fc-4c55-91ba-a097edf6da00":{"location":"ClientSideExtension.ApplicationCustomizer","properties":{"NavHeading":"Sites"}}}
```
 
## Deployment

In order to deploy to a real environment
* update the _cdnBasePath_ property in the write-manifests.json file with the URL to your CDN
* bundle and package the solution by executing the following commands in the command line:
  * `gulp bundle --ship`
  * `gulp package-solution --ship`
* upload the content of the ./temp/deploy subfolder of the sample root folder into your CDN
* add the reactHubsiteNavbar.appkg to the "Apps for SharePoint" library of the AppCatalog in your tenant. You may find the .appkg file in the project rootfolder/sharepoint/solution 

## Features

This project uses a SharePoint Framework Application Customizer, Hub Site API and SharePoint Search API
