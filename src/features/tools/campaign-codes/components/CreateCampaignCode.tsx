import { InfoContainer } from 'components/member/tabs/shared/card-components'
import {
  ClearableDropdown,
  DropdownOption,
} from 'features/tools/campaign-codes/components/ClearableDropdown'
import { VisibleNoDiscountForm } from 'features/tools/campaign-codes/forms/VisibleNoDiscountForm'
import { CreatableIncentiveTypes } from 'features/tools/campaign-codes/utils'
import { getTextFromEnumValue } from 'hedvig-ui/dropdown'
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

  const incentiveTypeOptions: DropdownOption[] = Object.values(
    CreatableIncentiveTypes,
  ).map((value, index) => {
    return {
      key: index + 1,
      value: value as string,
      text: getTextFromEnumValue(value as string),
    }
  })

  return (
    <InfoContainer>
      <ThirdLevelHeadline>Create New Code</ThirdLevelHeadline>
      <ClearableDropdown
        value={incentiveType ?? ''}
        options={incentiveTypeOptions}
        placeholder={'Incentive type'}
        onChange={(_, { value }) =>
          setIncentiveType(value as CreatableIncentiveTypes)
        }
        onClear={() => setIncentiveType(null)}
      />
      <Spacing bottom={'small'} />
      {incentiveType && getIncentiveTypeForm(incentiveType)}
    </InfoContainer>
  )
}
