import React, { useState } from 'react'
import {
  ClaimPaymentsDocument,
  useUpdateReserveMutation,
} from 'types/generated/graphql'

import { Button, Input, Spacing } from '@hedvig-ui'
import { PushUserAction } from 'portals/hope/features/tracking/utils/tags'
import { useNavigation } from '@hedvig-ui/hooks/navigation/use-navigation'

const isStringNumber = (s: string) => /^-?\d+$/.test(s) || /^\d+\.\d+$/.test(s)

const ClaimReserveForm: React.FC<{ claimId: string }> = ({ claimId }) => {
  const [updateReserve, { loading }] = useUpdateReserveMutation()
  const [value, setValue] = useState('')

  const { register } = useNavigation()

  return (
    <>
      <Input
        placeholder="Reserve amount"
        onChange={(e) => setValue(e.currentTarget.value)}
        {...register('Claim Reserve Input')}
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
          PushUserAction('claim', 'update', 'reserve', null)
        }}
      >
        Update reserve
      </Button>
    </>
  )
}

export { ClaimReserveForm }
