import {
  Button as MuiButton,
  List as MuiList,
  ListItem as MuiListItem,
  TextField as MuiTextField,
  Typography as MuiTypography,
  withStyles,
} from '@material-ui/core'
import {
  ClaimNote as ClaimNoteType,
  useClaimAddClaimNoteMutation,
  useClaimNotesQuery,
} from 'api/generated/graphql'
import { format, parseISO } from 'date-fns'

import { Field, FieldProps, Form, Formik } from 'formik'
import { Spinner } from 'hedvig-ui/sipnner'
import React from 'react'
import { sleep } from 'utils/sleep'

import { PaperTitle } from 'components/claims/claim-details/components/claim-items/PaperTitle'
import { Card, CardContent } from 'hedvig-ui/card'
import { BugFill } from 'react-bootstrap-icons'

interface Props {
  claimId: string
}

const TextArea: React.SFC<FieldProps<string>> = ({
  field: { onChange, onBlur, name, value },
}) => (
  <MuiTextField
    onChange={onChange}
    onBlur={onBlur}
    name={name}
    value={value || ''}
    multiline
    fullWidth
    placeholder="Type note here..."
  />
)

const sortNotesByDate = (notes: ReadonlyArray<ClaimNoteType>) =>
  [...notes].sort((noteA, noteB) => {
    return new Date(noteB.date).getTime() - new Date(noteA.date).getTime()
  })

const ListItem = withStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 0,
    paddingRight: 0,
    borderBottom: '1px solid rgba(0,0,0,0.08)',
  },
})(MuiListItem)

const ClaimNote = withStyles({
  root: {
    fontSize: '1rem',
    maxWidth: '80%',
    whiteSpace: 'pre-wrap',
  },
})(MuiTypography)

const ClaimNoteFooter = withStyles({
  root: {
    fontSize: '0.875rem',
    textAlign: 'right',
  },
})(MuiTypography)

const SubmitButton = withStyles({
  root: {
    marginTop: '1rem',
  },
})(MuiButton)

const ClaimNotes: React.FC<Props> = ({ claimId }) => {
  const {
    data: claimNotesData,
    refetch: refetchClaimNotes,
    loading: loadingClaimNotes,
    error: queryError,
  } = useClaimNotesQuery({
    variables: { claimId },
  })
  const notes = claimNotesData?.claim?.notes ?? []
  const [addClaimNote] = useClaimAddClaimNoteMutation()

  return (
    <Card span={1}>
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

        <MuiList>
          {sortNotesByDate(notes).map((note) => (
            <ListItem key={note.date + note.handlerReference}>
              <ClaimNote component="pre">{note.text}</ClaimNote>
              <ClaimNoteFooter component="span">
                {note.handlerReference && (
                  <>
                    {note.handlerReference}
                    <br />
                  </>
                )}
                {format(parseISO(note.date), 'yyyy-MM-dd HH:mm:ss')}
              </ClaimNoteFooter>
            </ListItem>
          ))}
        </MuiList>
        <Formik<{ text: string }>
          initialValues={{ text: '' }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true)
            await addClaimNote({
              variables: { claimId, note: { text: values.text } },
            })
            await sleep(1000)
            await refetchClaimNotes()
            setSubmitting(false)
            resetForm()
          }}
        >
          {({ isValid, isSubmitting }) => (
            <Form>
              <Field
                component={TextArea}
                placeholder="Type note content here"
                name="text"
              />
              <SubmitButton
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isValid || isSubmitting}
              >
                Add note {isSubmitting && <Spinner push="left" />}
              </SubmitButton>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  )
}

export { ClaimNotes }
