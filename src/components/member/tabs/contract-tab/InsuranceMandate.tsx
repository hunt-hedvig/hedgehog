import * as React from 'react'
import { ButtonLink } from '../../../../../shared/hedvig-ui/button'
import { Card } from '../../../../../shared/hedvig-ui/card'
import { Contract } from '../../../../api/generated/graphql'
import { ButtonSpacing } from './contract-item'

export const InsuranceMandateComponent: React.FunctionComponent<{
  contract: Contract
}> = ({ contract }) => {
  return (
    <Card span={2}>
      Insurance Mandate
      <ButtonSpacing>
        <ButtonLink
          target="_blank"
          href={`/api/member/mandate/${contract.holderMemberId}`}
        >
          Download
        </ButtonLink>
      </ButtonSpacing>
    </Card>
  )
}

export const InsuranceMandate = InsuranceMandateComponent
