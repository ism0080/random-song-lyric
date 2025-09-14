import { Hono } from 'hono'
import { GeniusAPI } from './util/genius.js'
import { LyricsAPI } from './util/lyrics.js'
import { fn } from './util/fn.js'
import { z } from 'zod/v4'

const app = new Hono()

const retrieveLyrics = fn(z.string(), async (artist: string) => {
  const songs = await GeniusAPI.searchArtistSongs(artist)

  const songIndex = Math.floor(Math.random() * songs.length)
  const song = songs[songIndex]

  const lyrics = await LyricsAPI.getLyrics({ artist: song.result.primary_artist.name, title: song.result.title })

  const title = song.result.full_title
  const { header_image_url: image } = song.result

  if (!lyrics || !lyrics.length) throw new Error('No lyrics found')

  const lineIndex = Math.floor(Math.random() * lyrics.length)

  return z.object({ lyrics: z.string(), title: z.string(), image: z.string().url() }).parse({ lyrics: lyrics[lineIndex], title, image })
})

app.get('/api', async (c) => {
  try {
    const artist = c.req.query('artist')

    if (!artist) {
      return c.json({ error: 'Missing artist parameter' }, 400)
    }

    const info = await retrieveLyrics(artist)

    return c.json({ info }, 200)
  } catch (err: any) {
    console.error('API error:', err?.message || err)
    return c.json({ error: err?.message || err }, 500)
  }
})

export default app
