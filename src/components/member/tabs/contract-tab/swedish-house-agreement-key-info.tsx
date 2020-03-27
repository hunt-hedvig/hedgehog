import * as React from 'react'
import { Card } from '../../../../../shared/hedvig-ui/card'
import {
  Contract,
  SwedishApartment,
  SwedishHouse,
} from '../../../../api/generated/graphql'
import { FlexWrapper } from './contract-item'

export const SwedishHouseAgreementKeyInfoComponent: React.FunctionComponent<{
  contract: Contract
  agreement: SwedishHouse
}> = ({ contract, agreement }) => {
  return (
    <FlexWrapper>
      <Card span={2}>
        <span>name: </span>
        <span>
          address line: {agreement.address.street}, {agreement.address.city}
        </span>
        <span>postcode: {agreement.address.postalCode}</span>
        <span>Type: {agreement.__typename}</span>
        <span>Persons in household: {agreement.numberCoInsured + 1}</span>
        <span>Living space: {agreement.squareMeters}</span>
      </Card>
      <Card span={2}>
        <span>Current Total Price: {agreement.basePremium}</span>
        <span>Status: {agreement.status}</span>
        <span>State:{}</span>
        <span>Signed: {} </span>
        <span>Current Insurer: {contract.switchedFrom}</span>
      </Card>
    </FlexWrapper>
  )
}

export const SwedishHouseAgreementKeyInfo = SwedishHouseAgreementKeyInfoComponent
