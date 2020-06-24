import { Chip } from '@material-ui/core'
import React from 'react'
import {
  Circle,
  CheckCircle,
  Gem,
  LightningFill,
  Pencil,
} from 'react-bootstrap-icons'
import { LightningWrapper } from './styles'

const SuggestiveChip: React.FC<{}> = () => {
  return (
    <Chip
      style={{
        backgroundColor: '#199381',
        color: 'white',
        marginTop: '8px',
        fontWeight: 'bold',
      }}
      avatar={
        <LightningWrapper>
          <Gem />
        </LightningWrapper>
      }
      clickable
      onDelete={() => console.log('delete')}
      onClick={() => console.log('click')}
      deleteIcon={
        <>
          <Chip
            label="4 800 SEK"
            style={{
              height: '70%',
              background: 'rgba(255, 255, 255, .2)',
              color: 'white',
              marginLeft: '0px',
            }}
          />
          <Chip
            style={{
              height: '70%',
              background: 'rgba(255, 255, 255, .2)',
              color: 'white',
              fontWeight: 'bold',
              marginLeft: '7px',
              marginRight: '7px',
            }}
            avatar={
              <LightningWrapper>
                <CheckCircle />
              </LightningWrapper>
            }
            label={'Using'}
          />
        </>
      }
      label="The depreciated valuation is"
    />
  )
}

const EditChip: React.FC<{ label: string }> = ({ label }) => {
  return (
    <Chip
      style={{
        backgroundColor: '#36658f',
        color: 'white',
        marginTop: '8px',
        fontWeight: 'bold',
        marginLeft: '7px',
      }}
      avatar={
        <LightningWrapper>
          <Pencil />
        </LightningWrapper>
      }
      label={label}
    />
  )
}

const CheckboxChip: React.FC<{ label: string }> = ({ label }) => {
  return (
    <Chip
      style={{
        backgroundColor: '#36658f',
        color: 'white',
        marginTop: '8px',
        fontWeight: 'bold',
        marginLeft: '7px',
      }}
      avatar={
        <LightningWrapper>
          <CheckCircle />
        </LightningWrapper>
      }
      label={label}
    />
  )
}

const InformativeChip: React.FC<{ label: string }> = ({ label }) => {
  return (
    <Chip
      style={{
        backgroundColor: '#36658f',
        color: 'white',
        marginTop: '8px',
        fontWeight: 'bold',
        marginLeft: '7px',
      }}
      avatar={
        <LightningWrapper>
          <LightningFill />
        </LightningWrapper>
      }
      label={label}
    />
  )
}

export const MessageChip: React.FC<{}> = () => {
  return (
    <>
      <SuggestiveChip />
      <EditChip label={'Edit'} />
    </>
  )
}
