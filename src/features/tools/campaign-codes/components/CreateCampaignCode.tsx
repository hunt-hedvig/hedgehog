import {
  InfoContainer,
  SearchableDropdown,
  Spacing,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import { FreeMonthsForm } from 'features/tools/campaign-codes/forms/FreeMonthsForm'
import { MonthlyPercentageForm } from 'features/tools/campaign-codes/forms/MonthlyPercentageForm'
import { NoDiscountForm } from 'features/tools/campaign-codes/forms/NoDiscountForm'
import { VisibleNoDiscountForm } from 'features/tools/campaign-codes/forms/VisibleNoDiscountForm'
import { CreatableIncentiveTypes } from 'features/tools/campaign-codes/utils'
import React from 'react'

const getIncentiveTypeForm = (incentiveType: CreatableIncentiveTypes) => {
  switch (incentiveType) {
    case CreatableIncentiveTypes.MonthlyPercentageDiscountFixedPeriod:
      return <MonthlyPercentageForm />
    case CreatableIncentiveTypes.FreeMonths:
      return <FreeMonthsForm />
    case CreatableIncentiveTypes.NoDiscount:
      return <NoDiscountForm />
    case CreatableIncentiveTypes.VisibleNoDiscount:
      return <VisibleNoDiscountForm />
    default:
      return <>Not available</>
  }
}

export const CreateCampaignCode: React.FC = () => {
  const [incentiveType, setIncentiveType] =
    React.useState<CreatableIncentiveTypes | null>(null)

  const incentiveTypeOptions = Object.values(CreatableIncentiveTypes).map(
    (value) => {
      return {
        value: value as string,
        label: convertEnumToTitle(value as string),
      }
    },
  )

  return (
    <InfoContainer>
      <ThirdLevelHeadline>Create Campaign</ThirdLevelHeadline>
      <SearchableDropdown
        value={
          incentiveType ? { label: incentiveType, value: incentiveType } : null
        }
        placeholder="Which incentive type?"
        isClearable={true}
        onChange={(data) =>
          setIncentiveType(
            data ? (data.value as CreatableIncentiveTypes) : null,
          )
        }
        noOptionsMessage={() => 'No incentive type found'}
        options={incentiveTypeOptions}
      />
      <Spacing bottom="small" />
      {incentiveType && getIncentiveTypeForm(incentiveType)}
    </InfoContainer>
  )
}
