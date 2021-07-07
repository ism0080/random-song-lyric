import express from 'express'
import Genius from 'genius-lyrics'
const Client = new Genius.Client(process.env.GENIUS_KEY)

const retrieveLyrics = async (artist: string) => {
  const songs = await Client.songs.search(artist)

  const indexSongs = Math.floor(Math.random() * Math.floor(songs.length))
  const lyrics = await songs[indexSongs].lyrics()
  const title = songs[indexSongs].fullTitle
  const image = songs[indexSongs].image

  const arrLyrics = lyrics.split('\n').filter((l: string) => l.length && l[0] !== '[')
  const indexLyrics = Math.floor(Math.random() * Math.floor(arrLyrics.length))
  return { lyrics: arrLyrics[indexLyrics], title, image }
}

module.exports = async (req: express.Request, res: express.Response) => {
  try {
    res.setHeader('content-type', 'application/json')
    res.send({
      status: 200,
      info: await retrieveLyrics(req.query.artist as string)
    })
  } catch (err) {
    console.log(err)
    res.send({
      status: 500,
      info: err
    })
  }
}
