import React from 'react'
import { Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'

import { SearchProps } from './interface'
import styles from './search.module.css'

export const Search = ({ onSubmit, loading }: SearchProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SearchData>()

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete='off'>
        <div className='form-group'>
          <label htmlFor='inputForArtist'>
            Artist
            <input
              id='inputForArtist'
              type='text'
              className='form-control'
              aria-describedby='Enter artist'
              placeholder="Enter Artist's Name"
              {...register('artist', {
                required: {
                  value: true,
                  message: 'Please enter an Artist'
                }
              })}
            />
          </label>
          {errors.artist && (
            <span role='alert' className={`${styles.errorMessage} mandatory`}>
              {errors.artist.message}
            </span>
          )}
        </div>
        <button type='submit' className='btn btn-outline-primary' disabled={loading}>
          {loading ? <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' /> : 'Get Lyric'}
        </button>
      </form>
    </div>
  )
}
