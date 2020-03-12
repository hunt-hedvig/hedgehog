import { Contract } from 'api/generated/graphql'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { SecondLevelHeadline, ThirdLevelHeadline } from 'hedvig-ui/typography'
import * as React from 'react'
import { MasterInception } from './master-inception'
import { TerminationDate } from './termination-date'

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
            <strong>Contract id:</strong> {contract.id}
          </span>
        </Card>
      </CardsWrapper>
    </>
  )
}
