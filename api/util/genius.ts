import { z } from 'zod/v4'
import { fn } from './fn'

const BASE_URL = 'https://api.genius.com'
const defaultUserAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36'

export namespace GeniusAPI {
  const ArtistSongsResponseSchema = z.object({
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

  export const searchArtistSongs = fn(z.string(), async (input) => {
    const url = `${BASE_URL}/search?q=${encodeURIComponent(input)}`
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.GENIUS_KEY}`,
        'User-Agent': defaultUserAgent
      }
    })
    const validatedData = await ArtistSongsResponseSchema.parseAsync(await res.json())

    validatedData.response.hits = validatedData.response.hits.filter((hit) => hit.type === 'song')

    if (!validatedData.response.hits.length) throw new Error('No songs found for this artist')

    return validatedData.response.hits
  })
}
