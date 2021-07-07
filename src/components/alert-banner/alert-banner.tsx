import React from 'react'

import { AlertBannerProps } from './alert-banner.interface'

export const AlertBanner = ({ errorText }: AlertBannerProps) => (
  <div className='alert fade show d-flex alert-danger' role='alert'>
    <p>{errorText}</p>
  </div>
)
