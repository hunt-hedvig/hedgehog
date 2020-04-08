import { Agreement as AgreementType, Contract } from 'api/generated/graphql'
import { FromDate } from 'components/member/tabs/contracts-tab/agreement/FromDate'
import { InsuranceCertificate } from 'components/member/tabs/contracts-tab/agreement/InsuranceCertificate'
import { InsuranceMandate } from 'components/member/tabs/contracts-tab/agreement/InsuranceMandate'
import { ToDate } from 'components/member/tabs/contracts-tab/agreement/ToDate'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import * as React from 'react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { withShowNotification } from 'utils/notifications'

const AgreementComponent: React.FC<{
  agreement: AgreementType
  contract: Contract
  refetch: () => Promise<void>
} & WithShowNotification> = ({
  agreement,
  contract,
  showNotification,
  refetch,
}) => {
  return (
    <>
      <CardsWrapper>
        <Card span={2}>
          <FromDate
            agreement={agreement}
            contract={contract}
            showNotification={showNotification}
          />
        </Card>
        <Card span={2}>
          <ToDate
            agreement={agreement}
            contract={contract}
            showNotification={showNotification}
          />
        </Card>
        <Card span={2}>
          <InsuranceMandate contract={contract} />
        </Card>
        <Card span={2}>
          <InsuranceCertificate
            contract={contract}
            agreement={agreement}
            showNotification={showNotification}
            refetch={refetch}
          />
        </Card>
      </CardsWrapper>
    </>
  )
}

export const Agreement = withShowNotification(AgreementComponent)
