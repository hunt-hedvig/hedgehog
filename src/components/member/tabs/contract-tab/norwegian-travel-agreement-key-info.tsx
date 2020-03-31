import * as React from 'react'
import { Card } from '../../../../../shared/hedvig-ui/card'
import { Contract, NorwegianTravel } from '../../../../api/generated/graphql'
import { Member } from '../../../../store/storeTypes'
import { FlexWrapper } from './contract-item'

export const NorwegianTravelAgreementKeyInfoComponent: React.FunctionComponent<{
  contract: Contract
  agreement: NorwegianTravel
  member: Member
}> = ({ contract, agreement, member }) => {
  return (
    <FlexWrapper>
      <Card span={2}>
        <span>name: {member.firstName}</span>
        <span>Number co-insured: {agreement.numberCoInsured}</span>
      </Card>
      <Card span={2}>
        <span>Current Total Price: {agreement.basePremium}</span>
        <span>Status: {agreement.status}</span>
        <span>From Date: {agreement.fromDate} </span>
        <span>Switched from: {contract.switchedFrom}</span>
      </Card>
    </FlexWrapper>
  )
}

export const NorwegianTravelAgreementKeyInfo = NorwegianTravelAgreementKeyInfoComponent
