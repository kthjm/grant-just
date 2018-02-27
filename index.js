const Koa = require('koa')
const Router = require('koa-router')
const session = require('koa-session')
const mount = require('koa-mount')
const Grant = require('grant-koa')
const opn = require('opn')

const assert = (expect, message) => {
  if (!expect) throw new Error(message)
}

module.exports = (port, config, { tokenName = 'ACCESS_TOKEN', secretName = 'ACCESS_SECRET' } = {}) => {

  assert(typeof port === 'number', 'invalid port')
  assert(typeof config === 'object' && !Array.isArray(config), 'invalid config')

  const app = new Koa()
  const router = new Router()
  const configKeys = Object.keys(config)

  const callbackMiddleware = (ctx) => {
    const { access_token, access_secret } = ctx.query
    ctx.body = Object
              .entries({ [tokenName]: access_token, [secretName]: access_secret })
              .map(([key,val]) => `${key}=${val}`)
              .join('\n')
  }

  configKeys
  .filter(key => config[key].callback)
  .map(key => config[key].callback)
  .forEach(callback => router.get(callback, callbackMiddleware))

  app
  .use(session({ key: 'grant:sess', maxAge: 'session', signed: false }, app))
  .use(mount(new Grant(config)))
  .use(router.routes())
  .listen(port, () =>
    Promise.all(
      configKeys
      .filter(key => key !== 'server')
      .map(provider => opn(`http://localhost:${port}/connect/${provider}`))
    )
  )
}