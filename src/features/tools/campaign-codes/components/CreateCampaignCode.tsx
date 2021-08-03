import { VisibleNoDiscountForm } from 'features/tools/campaign-codes/forms/VisibleNoDiscountForm'
import { CreatableIncentiveTypes } from 'features/tools/campaign-codes/utils'
import { getTextFromEnumValue } from 'hedvig-ui/dropdown'
import { InfoContainer } from 'hedvig-ui/info-row'
import { SearchableDropdown } from 'hedvig-ui/searchable-dropdown'
import { Spacing } from 'hedvig-ui/spacing'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { FreeMonthsForm } from '../forms/FreeMonthsForm'
import { MonthlyPercentageForm } from '../forms/MonthlyPercentageForm'

const getIncentiveTypeForm = (incentiveType: CreatableIncentiveTypes) => {
  switch (incentiveType) {
    case CreatableIncentiveTypes.MonthlyPercentageDiscountFixedPeriod:
      return <MonthlyPercentageForm />
    case CreatableIncentiveTypes.FreeMonths:
      return <FreeMonthsForm />
    case CreatableIncentiveTypes.VisibleNoDiscount:
      return <VisibleNoDiscountForm />
    default:
      return <>Not available</>
  }
}

export const CreateCampaignCode: React.FC = () => {
  const [
    incentiveType,
    setIncentiveType,
  ] = React.useState<CreatableIncentiveTypes | null>(null)

  const incentiveTypeOptions = Object.values(CreatableIncentiveTypes).map(
    (value) => {
      return {
        value: value as string,
        label: getTextFromEnumValue(value as string),
      }
    },
  )

  return (
    <InfoContainer>
      <ThirdLevelHeadline>Create New Code</ThirdLevelHeadline>
      <SearchableDropdown
        value={
          incentiveType ? { label: incentiveType, value: incentiveType } : null
        }
        placeholder={'Which incentive type?'}
        isClearable={true}
        onChange={(data) =>
          setIncentiveType(
            data ? (data.value as CreatableIncentiveTypes) : null,
          )
        }
        noOptionsMessage={() => 'No incentive type found'}
        options={incentiveTypeOptions}
      />
      <Spacing bottom={'small'} />
      {incentiveType && getIncentiveTypeForm(incentiveType)}
    </InfoContainer>
  )
}
