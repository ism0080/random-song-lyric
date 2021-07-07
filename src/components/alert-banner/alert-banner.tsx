import React from 'react'

import { AlertBannerProps } from './interface'

export const AlertBanner = ({ setError, errorText }: AlertBannerProps) => (
  <div className='alert fade show d-flex alert-danger' role='alert'>
    <p>{errorText}</p>
    <span aria-hidden='true' className='ml-auto cursor-pointer' onClick={() => setError(false)}>
      &times;
    </span>
  </div>
)
