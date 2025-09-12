import handler from './api/index.ts'
import { serve } from '@hono/node-server'

serve(handler, (info) => {
  console.log(`\n\n✅ Listening on http://localhost:${info.port}`)
})
