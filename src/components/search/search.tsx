import React from 'react'
import { Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import styles from './search.module.css'
import { SearchProps } from './interface'

export const Search = ({ onSubmit, loading }: SearchProps) => {
  const { register, handleSubmit, errors } = useForm()

  return (
    <div>
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
        <button type='submit' className='btn btn-outline-primary' disabled={loading}>
          {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : 'Get Lyric'}
        </button>
      </form>
    </div>
  )
}
