import { useUpdateReserveMutation } from 'api/generated/graphql'
import React, { useState } from 'react'

import { Button } from 'hedvig-ui/button'
import { Input } from 'hedvig-ui/input'
import { Spacing } from 'hedvig-ui/spacing'

const isStringNumber = (s: string) => /^-?\d+$/.test(s) || /^\d+\.\d+$/.test(s)

const ClaimReserveForm: React.FC<{ claimId: string }> = ({ claimId }) => {
  const [updateReserve, { loading }] = useUpdateReserveMutation()
  const [value, setValue] = useState('')

  return (
    <>
      <Input
        placeholder={'Reserve amount'}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
      <Spacing top={'small'} />
      <Button
        variation="primary"
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
          })
        }}
      >
        Update Reserve
      </Button>
    </>
  )
}

export { ClaimReserveForm }
