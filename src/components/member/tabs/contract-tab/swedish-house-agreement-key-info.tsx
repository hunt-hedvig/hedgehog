import * as React from 'react'
import { Card } from '../../../../../shared/hedvig-ui/card'
import {
  Contract,
  Member,
  SwedishApartment,
  SwedishHouse,
} from '../../../../api/generated/graphql'
import { FlexWrapper } from './contract-item'

export const SwedishHouseAgreementKeyInfoComponent: React.FunctionComponent<{
  contract: Contract
  agreement: SwedishHouse
  member: Member
}> = ({ contract, agreement, member }) => {
  return (
    <FlexWrapper>
      <Card span={2}>
        <span>name: {member.firstName}</span>
        <span>
          address: {agreement.address.street}, {agreement.address.city}
        </span>
        <span>postcode: {agreement.address.postalCode}</span>
        <span>Number co-insured: {agreement.numberCoInsured + 1}</span>
        <span>Living space: {agreement.squareMeters}</span>
      </Card>
      <Card span={2}>
        <span>Current Total Price: {agreement.basePremium}</span>
        <span>Status: {agreement.status}</span>
        <span>From Date: {agreement.fromDate} </span>
        <span>Current Insurer: {contract.switchedFrom}</span>
      </Card>
    </FlexWrapper>
  )
}

export const SwedishHouseAgreementKeyInfo = SwedishHouseAgreementKeyInfoComponent
