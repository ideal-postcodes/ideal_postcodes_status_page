# Ideal Postcodes Status Page

status.ideal-postcodes.co.uk is simple static web page designed to relay historical uptime from an external uptime monitoring service along with any incident information from a static JS file

## Design Goals

- Straightforward replication across geographies & data centres
- Simple & rapid build process & deployment with FTP or `git push`
- Minimal moving parts (no backend) - can be served on S3 or any static hosting service

## Getting started

* Install (if you don't have them):
    * [Node.js](http://nodejs.org)
    * [Brunch](http://brunch.io): `npm install -g brunch`
    * Brunch plugins and app dependencies: `npm install`
* Run:
    * `npm run start` or `brunch watch --server` — watches the project with continuous rebuild. This will also launch HTTP server with [pushState](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history).
* Learn:
    * `public/` dir is fully auto-generated and served by HTTP server.  Write your code in `app/` dir.
    * Place static files you want to be copied from `app/assets/` to `public/`.

## Configure

### Uptime Robot Probes

The status page queries the Uptime Robot API to retrieve historical availability and latencies. Probe keys can be updated at [`app/config.js`](app/config.js)

### Incidents

List any incidents that may have befallen one of your services

Incident history can be updated at [`app/config.js`](app/config.js)

### Branding

Assets specific to Ideal-Postcodes.co.uk have not been kept isolated. You you'll have to fork and modify the header, sidebar, footer and icon in order to adapt the branding.

## Deploy

Compile all assets into `public/` folder with

```
npm run build
```

You can then serve the status page directly from the `public/` directory and push it to your servers via FTP or `git push`

# Licence 

MIT
