import { fn } from './fn'
import { z } from 'zod/v4'

const defaultUserAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'

export namespace LyricsAPI {
  const GetLyricsInputSchema = z.object({
    artist: z.string(),
    title: z.string()
  })
  const MusixMatchResponseSchema = z.object({
    data: z.object({
      artistName: z.string(),
      trackName: z.string(),
      searchEngine: z.string(),
      artworkUrl: z.url(),
      lyrics: z.string()
    })
  })

  export const getLyrics = fn(GetLyricsInputSchema, async (input) => {
    const promises = [
      lyricsOvhResponse(input),
      lyricsApiResponse({ ...input, engine: 'musixmatch' }),
      lyricsApiResponse({ ...input, engine: 'youtube' })
    ]

    return Promise.any(promises).then((lyrics) => {
      return z
        .string()
        .nullable()
        .transform((val) => {
          if (!val) return null

          return val.split('\n').filter((line) => line.length && line[0] !== '[')
        })
        .safeParse(lyrics).data
    })
  })

  const lyricsOvhResponse = fn(GetLyricsInputSchema, async (input) => {
    const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(input.artist)}/${encodeURIComponent(input.title)}`

    const res = await fetch(url, {
      headers: {
        'User-Agent': defaultUserAgent
      }
    })

    const lyrics = await z.object({ lyrics: z.string().min(1, { error: 'Required' }) }).safeParseAsync(await await res.json())
    if (!lyrics.success) throw new Error('No lyrics found')

    return lyrics.data.lyrics
  })

  const lyricsApiResponse = fn(GetLyricsInputSchema.extend({ engine: z.enum(['musixmatch', 'youtube']) }), async (input) => {
    const url = `https://lyrics.lewdhutao.my.eu.org/v2/${input.engine}/lyrics?title=${encodeURIComponent(
      input.title
    )}&artist=${encodeURIComponent(input.artist)}`

    const res = await fetch(url, {
      headers: {
        'User-Agent': defaultUserAgent
      }
    })

    const lyrics = await MusixMatchResponseSchema.safeParseAsync(await res.json())
    if (!lyrics.success) throw new Error('No lyrics found')

    return lyrics.data.data.lyrics
  })
}
