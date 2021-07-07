import React from 'react'
import { Col, Media } from 'react-bootstrap'

import styles from './lyrics.less'

export const Lyrics = ({ image, title, lyrics }: GeniusLyricsData) => (
  <Col md={6} sm={12} xs={12} className={styles.lyricWrapper}>
    <Media>
      <img width={100} height={100} className='mr-3' src={image} alt={title} />
      <Media.Body>
        <h5 className={styles.truncate}>{title}</h5>
        <em>{lyrics}</em>
      </Media.Body>
    </Media>
  </Col>
)
