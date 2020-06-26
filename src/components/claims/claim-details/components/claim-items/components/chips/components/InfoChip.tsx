import React from 'react'
import { LightningFill } from 'react-bootstrap-icons'
import styled from 'react-emotion'
import { BaseChip } from './BaseChip'

const InfoChip: React.FC = ({}) => {
  const Chip = styled(BaseChip)`
    background: #36658f;
    color: white;
    margin-top: 8px;
    font-weight: bold;
    margin-left: 7px;
  `
  return (
    <Chip
      label={'Enter price and purchase date to get a valuation automatically'}
      icon={<LightningFill />}
    />
  )
}

export default InfoChip
