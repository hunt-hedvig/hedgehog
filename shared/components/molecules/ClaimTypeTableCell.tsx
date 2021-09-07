import { ClaimType } from 'api/generated/graphql'
import { Placeholder } from 'hedvig-ui/typography'
import React from 'react'
import { splitOnUpperCase } from 'utils/text'

export const ClaimTypeTableCell: React.FC<{ type?: ClaimType | null }> = ({
  type,
}) => {
  return (
    <>
      {type?.__typename ? (
        splitOnUpperCase(type.__typename.toString())
      ) : (
        <Placeholder>Not specified</Placeholder>
      )}
    </>
  )
}
