const f = require('fastify')({ logger: true })
const path = require('node:path')

f.register(require('@fastify/static'), {
  root: path.join(__dirname, 'web'),
  prefix: '/', // optional: default '/'
  //constraints: { host: 'example.com' } // optional: default {}
})

// Declare a route
f.get('/', function handler (request, reply) {
  reply.send({ hello: 'world' })
})

// Run the server!
f.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})