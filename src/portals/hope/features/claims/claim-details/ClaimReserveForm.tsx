import React, { useState } from 'react'
import {
  ClaimPaymentsDocument,
  useUpdateReserveMutation,
} from 'types/generated/graphql'
import { Button, Input, Spacing } from '@hedvig-ui'
import { PushUserAction } from 'portals/hope/features/tracking/utils/tags'
import { useClaimNotes } from 'portals/hope/features/claims/claim-details/ClaimNotes'

const isStringNumber = (s: string) => /^-?\d+$/.test(s) || /^\d+\.\d+$/.test(s)

const ClaimReserveForm: React.FC<{ claimId: string }> = ({ claimId }) => {
  const [updateReserve, { loading }] = useUpdateReserveMutation()
  const [value, setValue] = useState('')
  const [note, setNote] = useState('')

  const { createNote } = useClaimNotes(claimId)

  return (
    <>
      <Input
        value={value}
        placeholder="Reserve amount"
        onChange={(e) => setValue(e.currentTarget.value)}
      />
      <Spacing top="small" />
      <Input
        value={note}
        placeholder="Reserve note"
        onChange={(e) => setNote(e.currentTarget.value)}
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

          PushUserAction('claim', 'update', 'reserve', null)

          if (note) {
            createNote(note)
            PushUserAction('claim', 'add', 'note', null)
          }

          setValue('')
          setNote('')
        }}
      >
        Update reserve
      </Button>
    </>
  )
}

export { ClaimReserveForm }
