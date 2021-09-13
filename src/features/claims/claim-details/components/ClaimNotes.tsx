import { format, parseISO } from 'date-fns'
import React, { useState } from 'react'
import {
  ClaimNote as ClaimNoteType,
  useClaimAddClaimNoteMutation,
  useClaimPageQuery,
  useGetMeQuery,
} from 'types/generated/graphql'

import styled from '@emotion/styled'
import {
  Button,
  CardContent,
  FadeIn,
  List,
  ListItem,
  Paragraph,
  Shadowed,
  Spacing,
  Spinner,
  TextArea,
} from '@hedvig-ui'
import { CardTitle } from 'features/claims/claim-details/components/claim-items/CardTitle'
import { BugFill } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
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
  font-size: 0.8rem;
  text-align: right;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const NoteTip = styled(Paragraph)`
  text-align: right;
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const SubNoteWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
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
  const events = claimNotesData?.claim?.events ?? []

  const [addClaimNote] = useClaimAddClaimNoteMutation()
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [textFieldFocused, setTextFieldFocused] = useState(false)

  const { data } = useGetMeQuery()

  const handleSubmitNote = () => {
    const today = getTodayInUTC()

    setSubmitting(true)
    addClaimNote({
      variables: { claimId, note: { text: note } },
      optimisticResponse: {
        addClaimNote: {
          id: claimId,
          __typename: 'Claim',
          notes: [
            {
              text: note,
              handlerReference: data?.me?.email ?? '',
              date: today,
            },
            ...notes,
          ],
          events: [
            {
              text: `Note added: ${note}`,
              date: today,
            },
            ...events,
          ],
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
      <CardTitle
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
        onKeyPress={(e) => {
          if (
            e.altKey &&
            e.charCode === Keys.Enter.code &&
            !submitting &&
            note
          ) {
            handleSubmitNote()
          }
        }}
      />
      <Spacing top={'small'} />
      <SubNoteWrapper>
        <Button
          disabled={!note}
          variation={'primary'}
          onClick={() => handleSubmitNote()}
        >
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
      </SubNoteWrapper>
    </CardContent>
  )
}

export { ClaimNotes }
