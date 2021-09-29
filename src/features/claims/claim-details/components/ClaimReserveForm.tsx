import React, { useState } from 'react'
import {
  ClaimPaymentsDocument,
  useUpdateReserveMutation,
} from 'types/generated/graphql'

import { Button, Input, Spacing } from '@hedvig-ui'

const isStringNumber = (s: string) => /^-?\d+$/.test(s) || /^\d+\.\d+$/.test(s)

const ClaimReserveForm: React.FC<{ claimId: string; focus: boolean }> = ({
  claimId,
  focus,
}) => {
  const [updateReserve, { loading }] = useUpdateReserveMutation()
  const [value, setValue] = useState('')

  return (
    <>
      <Input
        focus={focus}
        placeholder="Reserve amount"
        onChange={(e) => setValue(e.currentTarget.value)}
      />
      <Spacing top="small" />
      <Button
        disabled={!isStringNumber(value) || value === '' || loading}
        onClick={async () => {
          await updateReserve({
            variables: {
              claimId,
              amount: {
                amount: value,
                currency: 'SEK',
              },
            },
            refetchQueries: [
              { query: ClaimPaymentsDocument, variables: { claimId } },
            ],
          })
          setValue('')
        }}
      >
        Update Reserve
      </Button>
    </>
  )
}

export { ClaimReserveForm }
