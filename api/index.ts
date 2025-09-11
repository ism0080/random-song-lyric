import { Hono } from 'hono'

const app = new Hono()

import Genius from 'genius-lyrics'

const Client = new Genius.Client(process.env.GENIUS_KEY!)

const retrieveLyrics = async (artist: string) => {
  const songs = await Client.songs.search(artist)

  if (!songs.length) throw new Error('No songs found for this artist')

  const songIndex = Math.floor(Math.random() * songs.length)
  const song = songs[songIndex]

  const lyrics = await song.lyrics()
  const title = song.fullTitle
  const { image } = song

  const lines = lyrics.split('\n').filter((line) => line.length && line[0] !== '[')

  if (!lines.length) throw new Error('No usable lyrics found')

  const lineIndex = Math.floor(Math.random() * lines.length)

  return { lyrics: lines[lineIndex], title, image }
}

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
