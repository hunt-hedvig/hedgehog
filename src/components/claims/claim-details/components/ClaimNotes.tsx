import {
  ClaimNote as ClaimNoteType,
  useClaimAddClaimNoteMutation,
  useClaimPageQuery,
  useGetMeQuery,
} from 'api/generated/graphql'
import { format, parseISO } from 'date-fns'
import { Spinner } from 'hedvig-ui/sipnner'
import React, { useState } from 'react'

import styled from '@emotion/styled'
import { PaperTitle } from 'components/claims/claim-details/components/claim-items/PaperTitle'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import { Button } from 'hedvig-ui/button'
import { CardContent } from 'hedvig-ui/card'
import { List, ListItem } from 'hedvig-ui/list'
import { Spacing } from 'hedvig-ui/spacing'
import { TextArea } from 'hedvig-ui/text-area'
import { Paragraph, Shadowed } from 'hedvig-ui/typography'
import { BugFill } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import { useCommandLine } from 'utils/hooks/command-line-hook'
import { Keys } from 'utils/hooks/key-press-hook'

const sortNotesByDate = (notes: ReadonlyArray<ClaimNoteType>) =>
  [...notes].sort((noteA, noteB) => {
    return new Date(noteB.date).getTime() - new Date(noteA.date).getTime()
  })

const getTodayInUTC = () => {
  const isoDate = new Date().toISOString()

  return `${isoDate.substr(0, 10)} ${isoDate.substr(11, 8)}`
}

const ClaimNoteWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 0.5em;
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

const NoteTip = styled(Paragraph)`
  text-align: right;
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const ClaimNotes: React.FC<{ claimId: string }> = ({ claimId }) => {
  const {
    data: claimNotesData,
    loading: loadingClaimNotes,
    error: queryError,
  } = useClaimPageQuery({
    variables: { claimId },
  })
  const notes = claimNotesData?.claim?.notes ?? []
  const [addClaimNote] = useClaimAddClaimNoteMutation()
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [textFieldFocused, setTextFieldFocused] = useState(false)

  const { data } = useGetMeQuery()

  const { registerActions } = useCommandLine()

  registerActions([
    {
      label: 'Add note',
      keys: [Keys.Option, Keys.Enter],
      onResolve: () => !submitting && textFieldFocused && handleSubmitNote(),
    },
  ])

  const handleSubmitNote = () => {
    setSubmitting(true)
    addClaimNote({
      variables: { claimId, note: { text: note } },
      optimisticResponse: {
        addClaimNote: {
          id: claimId,
          __typename: 'Claim',
          notes: [
            {
              id: 'temp-id',
              text: note,
              handlerReference: data?.me ?? '',
              date: getTodayInUTC(),
            },
            ...notes,
          ],
          events: [],
        },
      },
    })
      .then(() => {
        setNote('')
        setSubmitting(false)
      })
      .catch(() => {
        toast.error('Could not create note')
        setSubmitting(false)
      })
  }

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
        value={submitting ? '' : note}
        onChange={setNote}
        onFocus={() => setTextFieldFocused(true)}
        onBlur={() => setTextFieldFocused(false)}
      />
      <Spacing top={'small'} />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexDirection: 'row',
        }}
      >
        <Button variation={'primary'} onClick={async () => handleSubmitNote()}>
          Add note
        </Button>
        {textFieldFocused && (
          <FadeIn duration={200}>
            <NoteTip>
              Press <Shadowed>Option</Shadowed> + <Shadowed>Return</Shadowed> to
              add note
            </NoteTip>
          </FadeIn>
        )}
      </div>
    </CardContent>
  )
}

export { ClaimNotes }
