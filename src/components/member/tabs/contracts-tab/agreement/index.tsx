import {
  Agreement as AgreementType,
  AgreementStatus,
  Contract,
} from 'api/generated/graphql'
import { AgreementInfo } from 'components/member/tabs/contracts-tab/agreement/AgreementInfo'
import { FromDate } from 'components/member/tabs/contracts-tab/agreement/FromDate'
import { InsuranceCertificate } from 'components/member/tabs/contracts-tab/agreement/InsuranceCertificate'
import { InsuranceMandate } from 'components/member/tabs/contracts-tab/agreement/InsuranceMandate'
import { ToDate } from 'components/member/tabs/contracts-tab/agreement/ToDate'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import * as React from 'react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { withShowNotification } from 'utils/notifications'
import { CreateQuoteFromAgreement } from './CreateQuoteFromAgreement'

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
          <AgreementInfo agreement={agreement} />
        </Card>
        {agreement.status !== AgreementStatus.Pending && (
          <>
            <Card span={4}>
              <FromDate
                agreement={agreement}
                contract={contract}
                showNotification={showNotification}
              />
            </Card>
            <Card span={4}>
              <ToDate
                agreement={agreement}
                contract={contract}
                showNotification={showNotification}
              />
            </Card>
            <Card span={2}>
              <InsuranceCertificate
                contract={contract}
                agreement={agreement}
                showNotification={showNotification}
                refetch={refetch}
              />
            </Card>
          </>
        )}
        <Card span={2}>
          <CreateQuoteFromAgreement
            agreement={agreement}
            contract={contract}
            showNotification={showNotification}
          />
        </Card>
        <Card span={2}>
          <ThirdLevelHeadline>Debug</ThirdLevelHeadline>
          <span>
            <strong>Contract id:</strong> {contract.id}
          </span>
          <span>
            <strong>Member id:</strong> {contract.holderMemberId}
          </span>
          <span>
            <strong>Agreement id:</strong> {agreement.id}
          </span>
        </Card>
        <Card span={2}>
          <InsuranceMandate contract={contract} />
        </Card>
      </CardsWrapper>
    </>
  )
}

export const Agreement = withShowNotification(AgreementComponent)
