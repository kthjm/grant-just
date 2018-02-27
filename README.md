# grant just

```js
require('grant-just')(port, {
  server: { protocol: 'http', host: `localhost:${port}` },
  provider1: { key, secret, callback },
  provider2: { key, secret, callback }
},{
  tokenName?,
  secretName?
})
```