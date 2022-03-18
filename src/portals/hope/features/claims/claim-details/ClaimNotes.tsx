import { usePlatform } from '@hedvig-ui/hooks/use-platform'
import { addSeconds, format, parseISO } from 'date-fns'
import React, { useState } from 'react'
import {
  ClaimNotesFragment,
  useAddClaimNoteMutation,
  useClaimNotesQuery,
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
  TextArea,
} from '@hedvig-ui'
import { isPressing, Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useMe } from 'portals/hope/features/user/hooks/use-me'
import { toast } from 'react-hot-toast'
import formatDate from 'date-fns/format'
import { useDraft } from '@hedvig-ui/hooks/use-draft'
import gql from 'graphql-tag'
import { PushUserAction } from 'portals/hope/features/tracking/utils/tags'
import { useNavigation } from '@hedvig-ui/hooks/navigation/use-navigation'

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

gql`
  query ClaimNotes($claimId: ID!) {
    claim(id: $claimId) {
      id
      notes {
        text
        date
        handlerReference
      }
    }
  }

  mutation AddClaimNote($claimId: ID!, $note: ClaimNoteInput!) {
    addClaimNote(id: $claimId, note: $note) {
      id
      ...ClaimNotes
    }
  }

  fragment ClaimNotes on Claim {
    notes {
      text
      date
      handlerReference
    }
  }
`

interface UseClaimNotesResult {
  notes: ClaimNotesFragment['notes']
  createNote: (note: string) => void
  creating: boolean
}

export const useClaimNotes = (claimId: string): UseClaimNotesResult => {
  const [addClaimNote, { loading }] = useAddClaimNoteMutation()
  const { data } = useClaimNotesQuery({
    variables: { claimId },
  })

  const { me } = useMe()

  const createNote = (note: string) => {
    const today = formatDate(addSeconds(new Date(), 1), 'yyyy-MM-dd HH:mm:ss')

    PushUserAction('claim', 'add', 'note', null)

    addClaimNote({
      variables: { claimId, note: { text: note } },
      optimisticResponse: {
        addClaimNote: {
          __typename: 'Claim',
          id: claimId,
          notes: [
            {
              text: note,
              handlerReference: me.email ?? '',
              date: today,
            },
            ...notes,
          ],
        },
      },
    }).catch(() => {
      toast.error('Could not create note')
    })
  }

  const notes = (data?.claim?.notes ?? []).slice().sort((noteA, noteB) => {
    return new Date(noteB.date).getTime() - new Date(noteA.date).getTime()
  })

  return { notes, createNote, creating: loading }
}

const ClaimNotes: React.FC<{ claimId: string }> = ({ claimId }) => {
  const { notes, createNote, creating } = useClaimNotes(claimId)
  const [note, setNote] = useDraft(claimId)

  const { isMetaKey, metaKey } = usePlatform()

  const [textFieldFocused, setTextFieldFocused] = useState(false)

  const { register } = useNavigation()

  return (
    <CardContent>
      <CardTitle title="Notes" />
      <List>
        {notes.map(({ date, handlerReference, text }) => (
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
        value={creating ? '' : note}
        onChange={(e) => setNote(e.currentTarget.value)}
        onFocus={() => setTextFieldFocused(true)}
        onBlur={() => setTextFieldFocused(false)}
        onKeyDown={(e) => {
          if (isMetaKey(e) && isPressing(e, Keys.Enter) && !creating && note) {
            createNote(note)
            setNote('')
          }
        }}
        {...register('Claim Notes Textarea', {})}
      />
      <Spacing top="small" />
      <SubNoteWrapper>
        <Button
          disabled={!note || creating}
          onClick={() => {
            createNote(note)
            setNote('')
          }}
        >
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
