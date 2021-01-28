import React from 'react'
import { Col, Media } from 'react-bootstrap'

import { LyricsProps } from './interface'

import styles from './lyrics.module.css'

export const Lyrics = ({ image, title, lyric }: LyricsProps) => (
  <Col md={6} sm={12} xs={12} className={styles.lyricWrapper}>
    <Media>
      <img width={100} height={100} className='mr-3' src={image} alt={title} />
      <Media.Body>
        <h5 className={styles.truncate}>{title}</h5>
        <em>{lyric}</em>
      </Media.Body>
    </Media>
  </Col>
)
