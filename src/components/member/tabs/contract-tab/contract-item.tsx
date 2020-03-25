import { Contract } from 'api/generated/graphql'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { SecondLevelHeadline, ThirdLevelHeadline } from 'hedvig-ui/typography'
import * as React from 'react'
import styled from 'react-emotion'
import { AgreementItem } from './agreement-item'
import { MasterInception } from './master-inception'
import { TerminationDate } from './termination-date'

export const ButtonSpacing = styled('div')({
  paddingTop: '1rem',
})

export const FlexWrapper = styled('div')({
  display: 'flex',
})

export const ContractItem: React.FunctionComponent<{
  contract: Contract
}> = ({ contract }) => {
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
        <Card span={1}>
          <span>
            <strong>Market:</strong> {contract.market}
          </span>
        </Card>
        {contract.agreements.map((agreement) => (
          <AgreementItem agreement={agreement} contract={contract} />
        ))}
        <Card span={1}>
          <h4>Debug</h4>
          <span>
            <strong>Contract id:</strong> {contract.id}
          </span>
          <span>
            <strong>Member id:</strong> {contract.holderMemberId}
          </span>
        </Card>
      </CardsWrapper>
    </>
  )
}
