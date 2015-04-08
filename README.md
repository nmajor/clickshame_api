NODE_ENV=development DEBUG=express:* ./bin/www


API

post /strikes                        - create a strike
post /identities                     - create an identity

get  /strikes
params = {
  no-params: "top 10 most recent strikes",
  count: { data: "number", returns: "number of most recent strikes to show" },
}

get  /references
params = {
  no-params: "top 10 references with the most strikes",
  urls: { data: "array of urls", returns: "an array references with clickshame score if any, returns a blank array if not" }
  url: { data: "url string", returns: "a reference if one exists with the specific url, returns a blank array if not" }
  count: { data: "number", returns: "the top [count] references with the most strikes" },
}

get  /domains
params = {
  no-params: "top 10 domains with the most strikes",
  domains: { data: "array of domains", returns: "an array domains with clickshame score if any, returns a blank array if not" }
  domain: { data: "domain string", returns: "an array domains with clickshame score if any, returns a blank array if not" }
  urls: { data: "array of urls", returns: "an array domains with clickshame score if any, returns a blank array if not" }
  url: { data: "url string", returns: "a domains if one exists with the specific url, returns a blank array if not" }
  count: { data: "number", returns: "the top [count] domains with the most strikes" },
}

sequelize migration:create --name [migration_name] --config env/development.js


http://stackoverflow.com/questions/10608613/how-can-i-trigger-a-content-script-to-run-when-i-click-the-popup-icon-of-a-googl
http://stackoverflow.com/questions/20019958/chrome-extension-how-to-send-data-from-content-script-to-popup-html
https://developer.chrome.com/extensions/content_scripts#pi
https://developer.chrome.com/extensions/messaging
http://src.chromium.org/viewvc/chrome/trunk/src/chrome/common/extensions/docs/examples/api/messaging/timer/

