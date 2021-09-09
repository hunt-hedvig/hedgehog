import styled from '@emotion/styled'
import React from 'react'
import { LightningFill } from 'react-bootstrap-icons'
import { BaseChip } from './BaseChip'

const Chip = styled(BaseChip)`
  && {
    background: ${({ theme }) => theme.success};
    color: ${({ theme }) => theme.accentContrast};
    margin-top: 8px;
    font-weight: bold;
    margin-left: 7px;
  }
`

export const InfoChip: React.FC = ({}) => {
  return (
    <Chip
      label={'Enter price and purchase date to get a valuation automatically'}
      icon={<LightningFill />}
    />
  )
}
