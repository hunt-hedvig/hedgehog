import * as React from 'react'
import { Card } from '../../../../../shared/hedvig-ui/card'
import {
  Contract,
  Member,
  NorwegianHomeContent,
} from '../../../../api/generated/graphql'
import { useContractMarketInfo } from '../../../../graphql/use-get-member-contract-market-info'
import { FlexWrapper } from './contract-item'

export const NorwegianHomeContentAgreementKeyInfoComponent: React.FunctionComponent<{
  contract: Contract
  agreement: NorwegianHomeContent
  member: Member
}> = ({ contract, agreement, member }) => {
  return (
    <FlexWrapper>
      <Card span={2}>
        <span>Name: {member.firstName}</span>
        <span>
          Address: {agreement.address.street}, {agreement.address.city}
        </span>
        <span>Postcode: {agreement.address.postalCode}</span>
        <span>Number co-insured: {agreement.numberCoInsured}</span>
        <span>Living space: {agreement.squareMeters}</span>
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

export const NorwegianHomeContentAgreementKeyInfo = NorwegianHomeContentAgreementKeyInfoComponent
