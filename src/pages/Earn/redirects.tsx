import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'

// Redirects to stake but only replace the pathname
export function RedirectPathToEarnOnly({ location }: RouteComponentProps) {
  return <Redirect to={{ ...location, pathname: '/stake' }} />
}
