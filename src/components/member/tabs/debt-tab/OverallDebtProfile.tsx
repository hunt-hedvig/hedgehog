import { Debt } from 'api/generated/graphql'
import {
  InfoContainer,
  InfoRow,
  InfoText,
} from 'components/member/tabs/shared/card-components'
import { Card } from 'hedvig-ui/card'
import { Spacing } from 'hedvig-ui/spacing'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import { dateTimeFormatter } from 'lib/helpers'
import React from 'react'
import { formatMoney } from 'utils/money'

export const OverallDebtProfile: React.FunctionComponent<{
  debt: Debt
}> = ({ debt }) => (
  <Card span={2}>
    <InfoContainer>
      <InfoRow>
        <ThirdLevelHeadline>Public Debt</ThirdLevelHeadline>
      </InfoRow>

      <InfoRow>
        Total Amount
        <InfoText>
          {formatMoney(debt.totalAmountPublicDebt, {
            minimumFractionDigits: 0,
            useGrouping: true,
          })}
        </InfoText>
      </InfoRow>
      <InfoRow>
        Occurrences <InfoText>{debt.numberPublicDebts}</InfoText>
      </InfoRow>

      <Spacing top={'small'} />
      <InfoRow>
        <ThirdLevelHeadline>Private Debt</ThirdLevelHeadline>
      </InfoRow>

      <InfoRow>
        Total Amount
        <InfoText>
          {formatMoney(debt.totalAmountPrivateDebt, {
            minimumFractionDigits: 0,
            useGrouping: true,
          })}
        </InfoText>
      </InfoRow>
      <InfoRow>
        Occurrences
        <InfoText>{debt.numberPrivateDebts}</InfoText>
      </InfoRow>
      <Spacing top={'small'} />
      <InfoRow>
        Date of Debt Check
        <InfoText>
          {dateTimeFormatter(debt.fromDateTime, 'yyyy-MM-dd')}
        </InfoText>
      </InfoRow>
    </InfoContainer>
  </Card>
)
