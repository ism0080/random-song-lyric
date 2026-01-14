import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { event } from 'onedollarstats'

import { AlertBanner, Lyrics, Search } from '../../components'
import Hero from '../../images/branding.svg'
import styles from './home.module.less'

export const Home = () => {
  const [lyric, setLyric] = useState<GeniusLyricsData | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: SearchData) => {
    event('Search Lyrics', { artist: data.artist })
    setLoading(true)
    const params = new URLSearchParams({ artist: data.artist })

    fetch(`/api?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => ({ res: res.json(), status: res.status }))
      .then(async ({ res, status }) => {
        const data: GeniusResponse = await res
        const { info } = data
        if (status === 500) {
          setLoading(false)
          setError(true)
          setTimeout(() => {
            setError(false)
          }, 2000)
        } else {
          setLoading(false)
          setLyric({ lyrics: info.lyrics, title: info.title, image: info.image })
        }
      })
      .catch(() => {
        setLoading(false)
        setError(true)
        setTimeout(() => {
          setError(false)
        }, 2000)
      })
  }

  return (
    <div>
      {error && <AlertBanner errorText='Something went wrong' />}
      <img className={styles.hero} src={Hero} alt='lyrc' />
      <div className={styles.App}>
        <Container fluid>
          <h2>Random Song Lyric</h2>
          <Row>
            <Col md={6} sm={12} xs={12}>
              <Search loading={loading} onSubmit={onSubmit} />
            </Col>
            {lyric && <Lyrics title={lyric.title} image={lyric.image} lyrics={lyric.lyrics} />}
          </Row>
        </Container>
      </div>
    </div>
  )
}
