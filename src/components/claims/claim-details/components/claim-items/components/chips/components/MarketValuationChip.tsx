import React from 'react'
import { Gem } from 'react-bootstrap-icons'
import styled from 'react-emotion'
import { BaseChip } from './BaseChip'

const MarketValuationChip: React.FC = ({}) => {
  const Chip = styled(BaseChip)`
    background-color: #199381;
    color: white;
    margin-top: 8px;
    font-weight: bold;
  `
  return (
    <Chip
      label={'This item should be valued at the as-new price'}
      icon={<Gem />}
    />
  )
}

export default MarketValuationChip
