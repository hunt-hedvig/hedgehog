import * as React from 'react'
import styled from 'react-emotion'

const RedIcon = styled('i')({ color: '#FF8A80' })
const GreenIcon = styled('i')({ color: '#1BE9B6' })
const BlackIcon = styled('i')({ color: 'black', fontSize: '1.5em' })

export const CALL_ME =  <BlackIcon tooltip="Call me" className="fas fa-phone" />
export const CLAIM =  <BlackIcon tooltip="Claim" className="fab fa-amazon-pay" />
export const REMIND =  <BlackIcon tooltip="Remind" className="far fa-bell" />
export const MESSAGE =  <BlackIcon tooltip="Message" className="far fa-comment" />
export const OTHER  =  <BlackIcon tooltip="Other" className="fas fa-not-equal" />





