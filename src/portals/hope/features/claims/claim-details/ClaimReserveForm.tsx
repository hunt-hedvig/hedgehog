import React, { useEffect, useRef, useState } from 'react'
import {
  ClaimPaymentsDocument,
  useUpdateReserveMutation,
} from 'types/generated/graphql'

import { Button, Input, Spacing } from '@hedvig-ui'
import { PushUserAction } from 'portals/hope/features/tracking/utils/tags'

const isStringNumber = (s: string) => /^-?\d+$/.test(s) || /^\d+\.\d+$/.test(s)

const ClaimReserveForm: React.FC<{ claimId: string; focus?: boolean }> = ({
  claimId,
  focus,
}) => {
  const [updateReserve, { loading }] = useUpdateReserveMutation()
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focus && inputRef) {
      inputRef.current?.focus()
      inputRef.current?.scrollIntoView({
        inline: 'center',
        block: 'center',
        behavior: 'smooth',
      })
    }
  }, [focus])

  return (
    <>
      <Input
        placeholder="Reserve amount"
        onChange={(e) => setValue(e.currentTarget.value)}
        ref={inputRef}
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
