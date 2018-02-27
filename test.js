const port = 2000
const { CONSUMER_KEY: key, CONSUMER_SECRET: secret } = process.env
require('./index.js')(port, {
  server: { protocol: 'http', host: `localhost:${port}` },
  tumblr: { key, secret, callback: '/connected/tumblr' }
})