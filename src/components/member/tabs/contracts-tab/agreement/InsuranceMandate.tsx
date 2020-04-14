import { Contract } from 'api/generated/graphql'
import { ButtonLink } from 'hedvig-ui/button'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import * as React from 'react'

export const InsuranceMandate: React.FunctionComponent<{
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
