const Genius = require('genius-lyrics')
const Client = new Genius.Client()

const retrieveLyrics = async (artist) => {
  const songs = await Client.songs.search(artist)

  const indexSongs = Math.floor(Math.random() * Math.floor(songs.length))
  const lyrics = await songs[indexSongs].lyrics()
  const title = songs[indexSongs].fullTitle
  const image = songs[indexSongs].image

  const arrLyrics = lyrics.split('\n').filter((l) => l.length && l[0] !== '[')
  const indexLyrics = Math.floor(Math.random() * Math.floor(arrLyrics.length))
  return { lyrics: arrLyrics[indexLyrics], title, image }
}

module.exports = async (req, res) => {
  try {
    res.setHeader('content-type', 'application/json')
    res.send({
      status: 200,
      info: await retrieveLyrics(req.query.artist)
    })
  } catch (err) {
    console.log(err)
    res.send({
      status: 500,
      message: err
    })
  }
}
