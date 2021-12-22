import { Button, ThirdLevelHeadline } from '@hedvig-ui'
import React from 'react'
import { Contract } from 'types/generated/graphql'

export const InsuranceMandate: React.FC<{
  contract: Contract
}> = ({ contract }) => {
  return (
    <>
      <ThirdLevelHeadline>Insurance Mandate</ThirdLevelHeadline>
      <Button
        onClick={() =>
          window.open(
            `/api/member/mandate/${contract.holderMember.memberId}`,
            '_blank',
          )
        }
      >
        Download
      </Button>
    </>
  )
}
