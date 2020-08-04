import { InfoContainer } from 'components/member/tabs/shared/card-components'
import { MonthlyPercentageForm } from 'features/tools/campaign-codes/campaign-forms/monthly-percentage-form'
import { CreateableIncentiveTypes } from 'features/tools/campaign-codes/utils'
import { EnumDropdown } from 'hedvig-ui/dropdown'
import { Spacing } from 'hedvig-ui/spacing'
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

export const CreateCampaignCode: React.FC = () => {
  const [
    incentiveType,
    setIncentiveType,
  ] = React.useState<CreateableIncentiveTypes | null>(null)

  return (
    <InfoContainer>
      <ThirdLevelHeadline>Create New Code</ThirdLevelHeadline>
      <EnumDropdown
        enumToSelectFrom={CreateableIncentiveTypes}
        placeholder={'Incentive type'}
        setValue={setIncentiveType}
      />
      <Spacing bottom={'small'} />
      {incentiveType && getIncentiveTypeForm(incentiveType)}
    </InfoContainer>
  )
}
