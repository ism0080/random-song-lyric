import React, { useState } from 'react'
import { Col, Container, Media, Row, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import Hero from './images/branding.svg'

import styles from './App.module.css'

export const App = () => {
  const { register, handleSubmit, errors } = useForm()
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
      {error && (
        <div className={`alert fade show d-flex alert-danger`} role='alert'>
          <p>Something went wrong</p>
          <span aria-hidden='true' className='ml-auto cursor-pointer' onClick={() => setError(false)}>
            &times;
          </span>
        </div>
      )}
      <img className={styles.hero} src={Hero} alt='lyrc' />
      <div className={styles.App}>
        <Container fluid>
          <h2>Random Song Lyric</h2>
          <Row>
            <Col md={6} sm={12} xs={12}>
              <div className={styles.formWrapper}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete='off'>
                  <div className='form-group'>
                    <label htmlFor='inputForArtist'>Artist</label>
                    <input
                      id='inputForArtist'
                      name='artist'
                      type='text'
                      className='form-control'
                      aria-describedby='Enter artist'
                      placeholder="Enter Artist's Name"
                      ref={register({
                        required: {
                          value: true,
                          message: 'Please enter an Artist'
                        }
                      })}
                    />
                    {errors.artist && <span className={`${styles.errorMessage} mandatory`}>{errors.artist.message}</span>}
                  </div>
                  <button type='submit' className='btn btn-outline-primary'>
                    {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : 'Get Lyric'}
                  </button>
                </form>
              </div>
            </Col>
            {lyric.length > 0 && (
              <Col md={6} sm={12} xs={12} className={styles.lyricWrapper}>
                <Media>
                  <img width={100} height={100} className='mr-3' src={image} alt={title} />
                  <Media.Body>
                    <h5 className={styles.truncate}>{title}</h5>
                    <em>{lyric}</em>
                  </Media.Body>
                </Media>
              </Col>
            )}
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default App
