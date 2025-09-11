import type { VercelRequest, VercelResponse } from '@vercel/node'
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const artist = req.query.artist as string

    if (!artist) {
      return res.status(400).json({ status: 400, error: 'Missing artist parameter' })
    }

    const info = await retrieveLyrics(artist)

    return res.status(200).json({ status: 200, info })
  } catch (err: any) {
    console.error('API error:', err?.message || err)
    return res.status(500).json({ status: 500, error: err?.message || err })
  }
}
