import {
  InfoContainer,
  InfoRow,
} from 'components/member/tabs/shared/card-components'
import { MonthlyPercentageForm } from 'features/tools/campaign-codes/creatable-campaigns/monthly-percentage-form'
import { EnumDropdown } from 'hedvig-ui/dropdown'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'

const getIncentiveTypeForm = (incentiveType: CreateableIncentiveTypes) => {
  switch (incentiveType) {
    case CreateableIncentiveTypes.MonthlyPercentageDiscountFixedPeriod:
      return <MonthlyPercentageForm />
    default:
      return <>Not available</>
  }
}

enum CreateableIncentiveTypes {
  MonthlyPercentageDiscountFixedPeriod = 'Monthly Percentage, Fixed Period',
}

export const CreateCampaignCode: React.FC<{}> = () => {
  const [
    incentiveType,
    setIncentiveType,
  ] = React.useState<CreateableIncentiveTypes | null>(null)

  return (
    <InfoContainer>
      <InfoRow>
        <ThirdLevelHeadline>Create New Code</ThirdLevelHeadline>
      </InfoRow>
      <InfoRow>
        <EnumDropdown
          enumToSelectFrom={CreateableIncentiveTypes}
          placeholder={'Incentive type'}
          setValue={setIncentiveType}
        />
      </InfoRow>
      {incentiveType && getIncentiveTypeForm(incentiveType)}
    </InfoContainer>
  )
}
