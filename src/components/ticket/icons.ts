import * as React from 'react'
import styled from 'react-emotion'

const RedIcon = styled('i')({ color: '#FF8A80' })
const GreenIcon = styled('i')({ color: '#1BE9B6' })
const BlackIcon = styled('i')({ color: 'black', fontSize: '1.5em' })


// const CLAIM = 'CLAIM'
// const CALL_ME = 'CALL_ME'
// const MESSAGE = 'MESSAGE'
// const REMIND = 'REMIND'


export const CALL_ME = () => <BlackIcon className="fas fa-phone" />
export const CLAIM = () => <BlackIcon className="fab fa-amazon-pay" />
export const REMIND = () => <BlackIcon className="fas fa-user-clock" />
export const MESSAGE = () => <BlackIcon className="far fa-comment" />





