import React from 'react'
import { Gem } from 'react-bootstrap-icons'
import styled from 'react-emotion'
import { MonetaryAmountV2 } from 'src/api/generated/graphql'
import { formatMoney } from 'src/utils/money'
import { BaseChip } from './BaseChip'

const ValuationChip: React.FC<{
  valuation: MonetaryAmountV2
  ignored?: boolean
}> = ({ valuation, ignored = false }) => {
  const Chip = styled(BaseChip)`
    background-color: #199381;
    color: white;
    margin-top: 8px;
    font-weight: bold;
  `
  const AdornmentChip = styled(BaseChip)`
    height: 70%;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    margin-left: -6px;
    margin-right: 6px;
    padding-left: 0px;
    text-decoration: ${ignored ? 'line-through' : 'none'};
  `
  return (
    <Chip
      label={'The depreciated valuation is'}
      icon={<Gem />}
      adornment={<AdornmentChip label={formatMoney(valuation)} />}
    />
  )
}

export default ValuationChip
