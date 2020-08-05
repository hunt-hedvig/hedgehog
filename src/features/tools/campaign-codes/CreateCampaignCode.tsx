import { InfoContainer } from 'components/member/tabs/shared/card-components'
import { MonthlyPercentageForm } from 'features/tools/campaign-codes/campaign-forms/monthly-percentage-form'
import {
  ClearableDropdown,
  DropdownOption,
} from 'features/tools/campaign-codes/components/ClearableDropdown'
import { CreatableIncentiveTypes } from 'features/tools/campaign-codes/utils'
import { getTextFromEnumValue } from 'hedvig-ui/dropdown'
import { Spacing } from 'hedvig-ui/spacing'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'

const getIncentiveTypeForm = (incentiveType: CreatableIncentiveTypes) => {
  switch (incentiveType) {
    case CreatableIncentiveTypes.MonthlyPercentageDiscountFixedPeriod:
      return <MonthlyPercentageForm />
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
