declare type GeniusLyricsData = {
  lyrics: string
  title: string
  image: string
}

declare type GeniusResponse = {
  status: number
  info: GeniusLyricsData
}

declare type SearchData = {
  artist: string
}
