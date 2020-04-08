import { Contract as ContractType } from 'api/generated/graphql'
import { Agreement } from 'components/member/tabs/contracts-tab/agreement'
import { AgreementsTable } from 'components/member/tabs/contracts-tab/agreement/AgreementsTable'
import { MasterInception } from 'components/member/tabs/contracts-tab/contract/master-inception'
import { TerminationDate } from 'components/member/tabs/contracts-tab/contract/termination-date'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import {
  FourthLevelHeadline,
  SecondLevelHeadline,
  ThirdLevelHeadline,
} from 'hedvig-ui/typography'
import * as React from 'react'

export const Contract: React.FunctionComponent<{
  contract: ContractType
  refetch: () => Promise<any>
}> = ({ contract, refetch }) => {
  const [focusedAgreement, setFocusedAgreement] = React.useState<string>(
    contract.currentAgreementId,
  )

  return (
    <>
      <CardsWrapper>
        <Card>
          <SecondLevelHeadline>{contract.contractTypeName}</SecondLevelHeadline>
        </Card>
        <Card span={2}>
          <ThirdLevelHeadline>Master Inception</ThirdLevelHeadline>
          <MasterInception contract={contract} />
        </Card>
        <Card span={2}>
          <ThirdLevelHeadline>Termination Date</ThirdLevelHeadline>
          <TerminationDate contract={contract} />
        </Card>
      </CardsWrapper>
      <AgreementsTable
        agreements={contract.agreements}
        focusedAgreement={focusedAgreement}
        setFocusedAgreement={setFocusedAgreement}
      />
      <Agreement
        agreement={
          contract.agreements.find(
            (agreement) => agreement.id === focusedAgreement,
          )!
        }
        contract={contract}
        refetch={refetch}
      />
      <CardsWrapper>
        <Card span={2}>
          <ThirdLevelHeadline>Create Quote</ThirdLevelHeadline>
          <FourthLevelHeadline>TODO</FourthLevelHeadline>
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
            <strong>Agreement id:</strong> {focusedAgreement}
          </span>
        </Card>
      </CardsWrapper>
    </>
  )
}
