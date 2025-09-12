import { Hono } from 'hono'
import { parse, TextNode } from 'node-html-parser'
import { z } from 'zod/v4'

const SongsResponseSchema = z.object({
  response: z.object({
    hits: z.array(
      z.object({
        index: z.string(),
        type: z.string(),
        result: z.object({
          id: z.number(),
          title: z.string(),
          full_title: z.string(),
          url: z.string(),
          header_image_url: z.string()
        })
      })
    )
  })
})

const app = new Hono()

const BASE_URL = 'https://api.genius.com'
const defaultUserAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'

const getLyrics = async (url: string) => {
  const body = await fetch(url)
  const bodyText = await body.text()
  const document = parse(bodyText)
  const lyricsRoot = document.getElementById('lyrics-root')

  const lyrics = lyricsRoot
    ?.querySelectorAll("[data-lyrics-container='true']")
    .map((x) => {
      x.querySelectorAll('br').forEach((y) => {
        y.replaceWith(new TextNode('\n'))
      })
      return x.text
    })
    .join('\n')
    .trim()

  if (!lyrics) throw new Error('No lyrics found')

  return lyrics
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

  const lyrics = await getLyrics(song.result.url)
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
