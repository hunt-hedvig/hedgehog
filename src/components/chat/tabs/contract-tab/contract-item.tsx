import * as React from 'react'
import { Card, CardsWrapper } from '../../../../../shared/hedvig-ui/card'
import {
  SecondLevelHeadline,
  ThirdLevelHeadline,
} from '../../../../../shared/hedvig-ui/typography'
import { Contract } from '../../../../api/generated/graphql'
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
        <Card span={2}>
          <span>
            <b>Contract id:</b> {contract.id}
          </span>
        </Card>
      </CardsWrapper>
    </>
  )
}
