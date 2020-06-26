import { Chip as MuiChip } from '@material-ui/core'
import { useCanEvaluate } from 'graphql/use-can-evaluate'
import React from 'react'
import { EyeFill, Gem, Pencil, PlusCircle } from 'react-bootstrap-icons'
import styled from 'react-emotion'
import {
  MonetaryAmountV2,
  UpsertClaimItemInput,
} from '../../../../../../api/generated/graphql'
import { useGetEvaluation } from '../../../../../../graphql/use-get-evaluation'
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

  return <Chip label={'Custom valuation'} icon={<Pencil />} />
}

const AddChip: React.FC = ({}) => {
  const Chip = styled(ChipBase)`
    background-color: #36658f;
    color: white;
    margin-top: 8px;
    font-weight: bold;
    margin-left: 7px;
  `
  return <Chip label={'Add custom'} icon={<PlusCircle />} />
}

const InfoChip: React.FC = ({}) => {
  const StyledChip = styled(ChipBase)`
    background: #36658f;
    color: white;
    margin-top: 8px;
    font-weight: bold;
    margin-left: 7px;
  `
  return (
    <StyledChip
      label={'Enter price and purchase date to get a valuation for this item'}
      icon={<EyeFill />}
    />
  )
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
      label={"There's no valuation available for this item"}
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
  const priceAndDateAvailable =
    formData.purchasePriceAmount != null && formData.dateOfPurchase != null

  const [evaluationStatus] = useCanEvaluate(
    'SE_APARTMENT_RENT',
    formData.itemFamilyId,
    formData.itemTypeId,
  )

  const [evaluation] = useGetEvaluation(
    formData.purchasePriceAmount ?? 0,
    formData.itemFamilyId,
    'SE_APARTMENT_RENT',
    formData.dateOfPurchase,
    formData.itemTypeId,
    null,
  )

  const canEvaluate = !!formData.itemFamilyId && !!evaluationStatus?.canEvaluate

  return (
    <>
      {canEvaluate && priceAndDateAvailable ? (
        <>
          <ValuationChip
            valuation={{
              amount: evaluation?.depreciatedValue?.toString() ?? '-',
              currency: formData?.purchasePriceCurrency ?? 'SEK',
            }}
          />
          <EditChip />
        </>
      ) : canEvaluate ? (
        <InfoChip />
      ) : priceAndDateAvailable && !!formData.itemFamilyId ? (
        <>
          <NoValuationChip />
          <AddChip />
        </>
      ) : (
        <></>
      )}
    </>
  )
}
