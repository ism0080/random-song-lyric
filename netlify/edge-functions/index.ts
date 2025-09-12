import App from '../../api/index'
import { handle } from 'jsr:@hono/hono/netlify'

export default handle(App)
