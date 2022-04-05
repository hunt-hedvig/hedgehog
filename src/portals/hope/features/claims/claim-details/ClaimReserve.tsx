import styled from '@emotion/styled'
import {
  Button,
  CardTitle,
  Flex,
  InfoTag,
  Input,
  isStringNumber,
  Paragraph,
  Spacing,
} from '@hedvig-ui'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { PushUserAction } from 'portals/hope/features/tracking/utils/tags'
import { useClaimNotes } from 'portals/hope/features/claims/claim-details/ClaimNotes'
import { useClaimReserve } from 'portals/hope/common/hooks/use-claim-reserve'

const ReservesTag = styled(InfoTag)`
  font-weight: bold;
  font-size: 0.9em;
  width: auto;
  margin-right: 0.5em;
`

const ReservesText = styled(Paragraph)`
  color: ${({ theme }) => theme.semiStrongForeground};
`

export const ClaimReserve: React.FC<{ claimId: string }> = ({ claimId }) => {
  const { reserve, setReserve } = useClaimReserve(claimId)
  const [value, setValue] = useState('')
  const [note, setNote] = useState('')

  const { createNote } = useClaimNotes(claimId)

  return (
    <>
      <CardTitle title="Reserves" />
      <Flex style={{ marginBottom: '1.0em' }}>
        <ReservesTag status="highlight">
          {reserve.amount} {reserve.currency}
        </ReservesTag>{' '}
        <ReservesText>reserved</ReservesText>
      </Flex>
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
        disabled={!isStringNumber(value) || value === ''}
        onClick={() => {
          toast.promise(setReserve(value), {
            success: 'Reserve updated',
            loading: 'Updating reserve',
            error: 'Could not update reserve',
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
