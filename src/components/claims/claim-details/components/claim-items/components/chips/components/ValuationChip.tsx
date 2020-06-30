import React from 'react'
import { Gem } from 'react-bootstrap-icons'
import styled from 'react-emotion'
import { MonetaryAmountV2 } from 'src/api/generated/graphql'
import { formatMoney } from 'utils/money'
import { BaseChip } from './BaseChip'

interface BaseChipProps {
  ignored: boolean
}

const Chip = styled(BaseChip)`
  background-color: ${({ theme }) => theme.success};
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
  text-decoration: ${(props: BaseChipProps) =>
    props.ignored ? 'line-through' : 'none'};
`

const ValuationChip: React.FC<{
  valuation: MonetaryAmountV2
  ignored?: boolean
}> = ({ valuation, ignored = false }) => {
  const valuationLabel =
    valuation?.amount !== '...'
      ? formatMoney(valuation, {
          useGrouping: true,
          maximumFractionDigits: 0,
        })
      : '...'

  return (
    <>
      <Chip
        label={'The depreciated valuation is'}
        icon={<Gem />}
        adornment={<AdornmentChip ignored={ignored} label={valuationLabel} />}
      />
    </>
  )
}

export default ValuationChip
