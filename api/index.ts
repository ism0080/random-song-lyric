import { Hono } from 'hono'
import { z } from 'zod/v4'

const SongsResponseSchema = z.object({
  response: z.object({
    hits: z.array(
      z.object({
        index: z.string(),
        type: z.string(),
        result: z.object({
          id: z.number(),
          api_path: z.string(),
          title: z.string(),
          full_title: z.string(),
          url: z.string(),
          header_image_url: z.string(),
          primary_artist_names: z.string(),
          primary_artist: z.object({
            name: z.string()
          })
        })
      })
    )
  })
})

const app = new Hono()

const BASE_URL = 'https://api.genius.com'
const defaultUserAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'

const getLyrics = async (artist: string, title: string) => {
  const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
  const body = await fetch(url, {
    headers: {
      'User-Agent': defaultUserAgent
    }
  })
  const bodyText = await body.json()

  const lyrics = z.object({ lyrics: z.string().min(1, { error: 'Required' }) }).safeParse(bodyText)

  if (!lyrics.success) throw new Error('No lyrics found')

  return lyrics.data.lyrics
}

const retrieveLyrics = async (artist: string) => {
  const songsResult = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(artist)}`, {
    headers: {
      Authorization: `Bearer ${process.env.GENIUS_KEY}`,
      'User-Agent': defaultUserAgent
    }
  })
  const songsData = await SongsResponseSchema.parseAsync(await songsResult.json())
  songsData.response.hits = songsData.response.hits.filter((hit) => hit.type === 'song')

  if (!songsData.response.hits.length) throw new Error('No songs found for this artist')

  const songs = songsData.response.hits

  const songIndex = Math.floor(Math.random() * songs.length)
  const song = songs[songIndex]

  const lyrics = await getLyrics(song.result.primary_artist.name, song.result.title)
  const title = song.result.full_title
  const { header_image_url: image } = song.result

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
