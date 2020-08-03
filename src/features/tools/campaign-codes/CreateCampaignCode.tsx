import {
  InfoContainer,
  InfoRow,
} from 'components/member/tabs/shared/card-components'
import { MonthlyPercentageForm } from 'features/tools/campaign-codes/creatable-campaigns/monthly-percentage-form'
import { EnumDropdown } from 'hedvig-ui/dropdown'
import { Spacing } from 'hedvig-ui/spacing'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { Dropdown, Input } from 'semantic-ui-react'

const getIncentiveTypeForm = (incentiveType: CreateableIncentiveTypes) => {
  switch (incentiveType) {
    case CreateableIncentiveTypes.MonthlyPercentageDiscountFixedPeriod:
      return <MonthlyPercentageForm />
    default:
      return <>Not available</>
  }
}

enum CreateableIncentiveTypes {
  MonthlyPercentageDiscountFixedPeriod = 'Monthly Percentage',
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
        <div style={{ width: '48%', float: 'left' }}>
          <EnumDropdown
            enumToSelectFrom={CreateableIncentiveTypes}
            placeholder={'Incentive type'}
            setValue={setIncentiveType}
          />
        </div>
        <div style={{ width: '48%', float: 'right' }}>
          <Spacing top={'small'} />
          <Dropdown
            label={'Partner'}
            placeholder="Partner"
            search
            fluid
            selection
            options={[]}
            onChange={(_, data) => void 0}
          />
        </div>
      </InfoRow>
      <Spacing bottom={'small'} />
      {incentiveType && getIncentiveTypeForm(incentiveType)}
    </InfoContainer>
  )
}
