import React from 'react'
import { EyeFill } from 'react-bootstrap-icons'
import styled from 'react-emotion'
import { BaseChip } from './BaseChip'

const NoValuationChip: React.FC = ({}) => {
  const StyledChip = styled(BaseChip)`
    background: #36658f;
    color: white;
    margin-top: 8px;
    font-weight: bold;
    margin-left: 7px;
  `
  return (
    <StyledChip
      label={"There's no valuation available for this item"}
      icon={<EyeFill />}
    />
  )
}

export default NoValuationChip
