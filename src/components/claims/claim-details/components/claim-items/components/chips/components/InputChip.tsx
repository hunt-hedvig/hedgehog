import React from 'react'
import { Pencil } from 'react-bootstrap-icons'
import styled from 'react-emotion'

import { TextField } from '@material-ui/core'
import { BaseChip } from './BaseChip'

const InputChip: React.FC = ({}) => {
  const Chip = styled(BaseChip)`
    background-color: #36658f;
    color: white;
    margin-top: 8px;
    font-weight: bold;
    margin-left: 7px;
    width: 100px;
  `

  return (
    <Chip
      label={''}
      icon={<Pencil />}
      adornment={
        <TextField
          style={{
            marginLeft: '-22%',
            width: 'auto',
          }}
          InputProps={{
            style: {
              border: '0px',
              backgroundColor: 'rgba(0,0,0,0)',
              marginTop: '14px',
              color: 'white',
              fontSize: '0.85rem',
              paddingRight: '0px',
            },
          }}
        />
      }
    />
  )
}

export default InputChip
