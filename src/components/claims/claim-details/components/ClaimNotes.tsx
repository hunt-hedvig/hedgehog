import {
  ClaimNote as ClaimNoteType,
  useClaimAddClaimNoteMutation,
  useClaimPageQuery,
} from 'api/generated/graphql'
import { format, parseISO } from 'date-fns'
import { Spinner } from 'hedvig-ui/sipnner'
import React, { useState } from 'react'
import { sleep } from 'utils/sleep'

import styled from '@emotion/styled'
import { PaperTitle } from 'components/claims/claim-details/components/claim-items/PaperTitle'
import { Button } from 'hedvig-ui/button'
import { CardContent } from 'hedvig-ui/card'
import { List, ListItem } from 'hedvig-ui/list'
import { Spacing } from 'hedvig-ui/spacing'
import { TextArea } from 'hedvig-ui/text-area'
import { Paragraph } from 'hedvig-ui/typography'
import { BugFill } from 'react-bootstrap-icons'

const sortNotesByDate = (notes: ReadonlyArray<ClaimNoteType>) =>
  [...notes].sort((noteA, noteB) => {
    return new Date(noteB.date).getTime() - new Date(noteA.date).getTime()
  })

const ClaimNoteWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 0.5em;
  border-bottom: 1px solid ${({ theme }) => theme.backgroundTransparent};
`

const ClaimNote = styled(Paragraph)`
  font-size: 1rem;
  max-width: 80%;
  white-space: pre-wrap;
`

const ClaimNoteFooter = styled(Paragraph)`
  font-size: 0.875rem;
  text-align: right;
`

const ClaimNotes: React.FC<{ claimId: string }> = ({ claimId }) => {
  const {
    data: claimNotesData,
    refetch: refetchClaimNotes,
    loading: loadingClaimNotes,
    error: queryError,
  } = useClaimPageQuery({
    variables: { claimId },
  })
  const notes = claimNotesData?.claim?.notes ?? []
  const [addClaimNote] = useClaimAddClaimNoteMutation()
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  return (
    <CardContent>
      <PaperTitle
        title={'Notes'}
        badge={
          queryError
            ? {
                icon: BugFill,
                status: 'danger',
                label: 'Internal Error',
              }
            : null
        }
      />
      {loadingClaimNotes && <Spinner />}

      <List>
        {sortNotesByDate(notes).map(({ date, handlerReference, text }) => (
          <ListItem key={date + handlerReference}>
            <ClaimNoteWrapper>
              <ClaimNote>{text}</ClaimNote>
              <ClaimNoteFooter>
                {handlerReference && (
                  <>
                    {handlerReference}
                    <br />
                  </>
                )}
                {format(parseISO(date), 'yyyy-MM-dd HH:mm:ss')}
              </ClaimNoteFooter>
            </ClaimNoteWrapper>
          </ListItem>
        ))}
      </List>

      <TextArea
        placeholder={'Your note goes here...'}
        value={note}
        onChange={setNote}
      />
      <Spacing top={'small'} />
      <Button
        loading={submitting}
        variation={'primary'}
        onClick={async () => {
          setSubmitting(true)
          await addClaimNote({
            variables: { claimId, note: { text: note } },
          })
          await sleep(1000)
          await refetchClaimNotes()
          setNote('')
          setSubmitting(false)
        }}
      >
        Add note
      </Button>
    </CardContent>
  )
}

export { ClaimNotes }
