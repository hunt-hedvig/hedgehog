import { ButtonLink } from '@hedvig-ui'
import { Contract } from 'api/generated/graphql'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'

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
