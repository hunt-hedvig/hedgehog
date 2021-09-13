import { ButtonLink, ThirdLevelHeadline } from '@hedvig-ui'
import React from 'react'
import { Contract } from 'types/generated/graphql'

export const InsuranceMandate: React.FC<{
  contract: Contract
}> = ({ contract }) => {
  return (
    <>
      <ThirdLevelHeadline>Insurance Mandate</ThirdLevelHeadline>
      <ButtonLink
        variation={'primary'}
        halfWidth
        target="_blank"
        href={`/api/member/mandate/${contract.holderMemberId}`}
      >
        Download
      </ButtonLink>
    </>
  )
}
