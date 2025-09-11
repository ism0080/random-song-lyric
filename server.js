import { Hono } from 'hono'
import handler from './api/index.ts'
import { serve } from '@hono/node-server'

const app = new Hono()

app.get('/api', (c) => handler(c.req, c.res))

serve(app, (info) => {
  console.log(`\n\n✅ Listening on http://localhost:${info.port}`)
})
