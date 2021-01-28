import React, { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

import Hero from '../../images/branding.svg'
import { AlertBanner, Lyrics, Search } from '../../components'

import styles from './home.module.css'

export const Home = () => {
  const [lyric, setLyric] = useState('')
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: any) => {
    setLoading(true)
    const params = new URLSearchParams({ artist: data.artist })
    fetch(`/api?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then(({ info, status }) => {
        if (status === 500) {
          setLoading(false)
          setError(true)
          setTimeout(() => {
            setError(false)
          }, 2000)
        } else {
          setLoading(false)
          setLyric(info.lyrics)
          setTitle(info.title)
          setImage(info.image)
        }
      })
  }

  return (
    <div>
      {error && <AlertBanner setError={setError} errorText='Something went wrong' />}
      <img className={styles.hero} src={Hero} alt='lyrc' />
      <div className={styles.App}>
        <Container fluid>
          <h2>Random Song Lyric</h2>
          <Row>
            <Col md={6} sm={12} xs={12}>
              <Search loading={loading} onSubmit={onSubmit} />
            </Col>
            {lyric.length > 0 && <Lyrics title={title} image={image} lyric={lyric} />}
          </Row>
        </Container>
      </div>
    </div>
  )
}
