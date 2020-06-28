import React from 'react'
import { Pencil } from 'react-bootstrap-icons'
import styled from 'react-emotion'

import { TextField } from '@material-ui/core'
import { BaseChip } from './BaseChip'

const Chip = styled(BaseChip)`
  background-color: ${({ theme }) => theme.accent};
  color: white;
  margin-top: 8px;
  font-weight: bold;
  margin-left: 7px;
  width: 100px;
  cursor: pointer;
`

const InputChip: React.FC<{
  value: string
  placeholder: string
  onChange: React.EventHandler<any>
}> = ({ value, placeholder, onChange }) => {
  const [isActive, setIsActive] = React.useState(false)

  return (
    <>
      <Chip
        label={isActive || value !== '' ? '' : placeholder}
        icon={<Pencil />}
        adornment={
          <TextField
            style={{
              marginLeft: '-28%',
              width: 'auto',
            }}
            value={value}
            onChange={onChange}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
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
    </>
  )
}

export default InputChip
