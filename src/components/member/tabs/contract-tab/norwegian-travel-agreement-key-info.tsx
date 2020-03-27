import * as React from 'react'
import { Card } from '../../../../../shared/hedvig-ui/card'
import { Contract, NorwegianTravel } from '../../../../api/generated/graphql'
import { FlexWrapper } from './contract-item'

export const NorwegianTravelAgreementKeyInfoComponent: React.FunctionComponent<{
  contract: Contract
  agreement: NorwegianTravel
}> = ({ contract, agreement }) => {
  return (
    <FlexWrapper>
      <Card span={2}>
        <span>name: </span>
        <span>Type: {agreement.__typename}</span>
        <span>Number of insureds: {agreement.numberCoInsured + 1}</span>
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

export const NorwegianTravelAgreementKeyInfo = NorwegianTravelAgreementKeyInfoComponent
