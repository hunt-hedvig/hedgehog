import { Chip as MuiChip } from '@material-ui/core'
import React from 'react'
import { EyeFill, Gem, Pencil, PlusCircle } from 'react-bootstrap-icons'
import styled from 'react-emotion'
import {
  MonetaryAmountV2,
  UpsertClaimItemInput,
} from '../../../../../../api/generated/graphql'
import { formatMoney } from '../../../../../../utils/money'
import { ChipIconBase } from './styles'

const ChipBase: React.ElementType<{
  label: string
  icon?: React.ReactElement | undefined
  adornment?: React.ReactElement | undefined
  clickable?: boolean
  className?: string
}> = ({ label, icon, adornment, clickable = false, className }) => {
  return (
    <MuiChip
      avatar={icon ? <ChipIconBase>{icon}</ChipIconBase> : undefined}
      clickable={clickable}
      onDelete={() => console.log('delete')}
      onClick={() => console.log('click')}
      deleteIcon={<>{adornment}</>}
      label={label}
      className={className}
    />
  )
}

const EditChip: React.FC = ({}) => {
  const Chip = styled(ChipBase)`
    background-color: #36658f;
    color: white;
    margin-top: 8px;
    font-weight: bold;
    margin-left: 7px;
  `

  return <Chip label={'Edit'} icon={<Pencil />} />
}

const AddChip: React.FC = ({}) => {
  const Chip = styled(ChipBase)`
    background-color: #36658f;
    color: white;
    margin-top: 8px;
    font-weight: bold;
    margin-left: 7px;
  `
  return <Chip label={'Add'} icon={<PlusCircle />} />
}

const NoValuationChip: React.FC = ({}) => {
  const StyledChip = styled(ChipBase)`
    background: #36658f;
    color: white;
    margin-top: 8px;
    font-weight: bold;
    margin-left: 7px;
  `
  return (
    <StyledChip
      label={'Would you like to add a valuation?'}
      icon={<EyeFill />}
    />
  )
}

const ValuationChip: React.FC<{ valuation: MonetaryAmountV2 }> = ({
  valuation,
}) => {
  const Chip = styled(ChipBase)`
    background-color: #199381;
    color: white;
    margin-top: 8px;
    font-weight: bold;
  `
  const AdornmentChip = styled(ChipBase)`
    height: 70%;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    margin-left: -6px;
    margin-right: 6px;
    padding-left: 0px;
  `
  return (
    <Chip
      label={'The depreciated valuation is'}
      icon={<Gem />}
      adornment={<AdornmentChip label={formatMoney(valuation)} />}
    />
  )
}

export const MessageChip: React.FC<{
  formData: UpsertClaimItemInput
}> = ({ formData }) => {
  const showValuation =
    formData.purchasePriceAmount != null && formData.dateOfPurchase != null

  return (
    <>
      {showValuation && (
        <>
          <ValuationChip
            valuation={{
              amount: '4800',
              currency: formData.purchasePriceCurrency ?? 'SEK',
            }}
          />
          <EditChip />
        </>
      )}
    </>
  )
}
