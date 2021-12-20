import { usePlatform } from '@hedvig-ui/hooks/use-platform'
import { format, parseISO } from 'date-fns'
import React, { useState } from 'react'
import {
  ClaimNote as ClaimNoteType,
  useClaimAddClaimNoteMutation,
  useClaimPageQuery,
} from 'types/generated/graphql'

import styled from '@emotion/styled'
import {
  Button,
  CardContent,
  CardTitle,
  FadeIn,
  List,
  ListItem,
  Paragraph,
  Shadowed,
  Spacing,
  Spinner,
  TextArea,
} from '@hedvig-ui'
import { isPressing, Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useMe } from 'portals/hope/features/user/hooks/use-me'
import { BugFill } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'

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

const ClaimNotes: React.FC<{ claimId: string; focus: boolean }> = ({
  claimId,
  focus,
}) => {
  const {
    data: claimNotesData,
    loading: loadingClaimNotes,
    error: queryError,
  } = useClaimPageQuery({
    variables: { claimId },
  })
  const { isMetaKey, metaKey } = usePlatform()
  const notes = claimNotesData?.claim?.notes ?? []
  const events = claimNotesData?.claim?.events ?? []

  const [addClaimNote] = useClaimAddClaimNoteMutation()
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [textFieldFocused, setTextFieldFocused] = useState(false)

  const { me } = useMe()

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
              handlerReference: me.email ?? '',
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
        title="Notes"
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
        resize
        placeholder="Your note goes here..."
        value={submitting ? '' : note}
        onChange={(e) => setNote(e.currentTarget.value)}
        focus={focus}
        onFocus={() => setTextFieldFocused(true)}
        onBlur={() => setTextFieldFocused(false)}
        onKeyDown={(e) => {
          if (
            isMetaKey(e) &&
            isPressing(e, Keys.Enter) &&
            !submitting &&
            note
          ) {
            handleSubmitNote()
          }
        }}
      />
      <Spacing top="small" />
      <SubNoteWrapper>
        <Button disabled={!note} onClick={() => handleSubmitNote()}>
          Add note
        </Button>
        {textFieldFocused && (
          <FadeIn duration={200}>
            <NoteTip>
              Press <Shadowed>{metaKey.hint}</Shadowed> +{' '}
              <Shadowed>Enter</Shadowed> to add note
            </NoteTip>
          </FadeIn>
        )}
      </SubNoteWrapper>
    </CardContent>
  )
}

export { ClaimNotes }
