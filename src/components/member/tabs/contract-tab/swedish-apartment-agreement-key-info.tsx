import * as React from 'react'
import { Card } from '../../../../../shared/hedvig-ui/card'
import {
  Contract,
  Member,
  SwedishApartment,
} from '../../../../api/generated/graphql'
import { FlexWrapper } from './contract-item'

export const SwedishApartmentAgreementKeyInfoComponent: React.FunctionComponent<{
  contract: Contract
  agreement: SwedishApartment
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
        <span>Number co-insured: {agreement.numberCoInsured}</span>
        <span>Living space: {agreement.squareMeters}</span>
      </Card>
      <Card span={2}>
        <span>Current Total Price: {agreement.basePremium}</span>
        <span>Status: {agreement.status}</span>
        <span>From Date: {agreement.fromDate} </span>
        <span>
          Switched from:{' '}
          {contract.switchedFrom === null ? 'N/A' : contract.switchedFrom}
        </span>
      </Card>
    </FlexWrapper>
  )
}

export const SwedishApartmentAgreementKeyInfo = SwedishApartmentAgreementKeyInfoComponent
