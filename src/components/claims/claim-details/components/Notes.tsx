import { Button, List, ListItem, TextField } from '@material-ui/core'
import { Field, FieldProps, Form, Formik } from 'formik'
import gql from 'graphql-tag'
import * as React from 'react'
import { Mutation } from 'react-apollo'
import { CustomPaper } from './Styles'

const ADD_CLAIM_NOTE_QUERY = gql`
  query AddClaimQuery($id: ID!) {
    claim(id: $id) {
      notes {
        text
      }
      events {
        text
        date
      }
    }
  }
`

const ADD_CLAIM_NOTE_MUTATION = gql`
  mutation AddClaimNote($id: ID!, $note: ClaimNoteInput!) {
    addClaimNote(id: $id, note: $note) {
      notes {
        text
      }
      events {
        text
        date
      }
    }
  }
`

interface Note {
  text: string
}

interface Props {
  notes: Note[]
  claimId: string
}

const TextArea: React.SFC<FieldProps<HTMLTextAreaElement>> = ({
  field: { onChange, onBlur, name, value },
}) => (
  <TextField
    onChange={onChange}
    onBlur={onBlur}
    name={name}
    value={value || ''}
    multiline
    fullWidth
    placeholder="Type note here..."
  />
)

const Notes: React.SFC<Props> = ({ notes, claimId }) => (
  <Mutation
    mutation={ADD_CLAIM_NOTE_MUTATION}
    update={(cache, { data: updateData }) => {
      cache.writeQuery({
        query: ADD_CLAIM_NOTE_QUERY,
        variables: { id: claimId },
        data: {
          claim: {
            notes: updateData.addClaimNote.notes,
            events: updateData.addClaimNote.events,
            __typename: updateData.addClaimNote.__typename,
          },
        },
      })
    }}
  >
    {(addClaimNote) => (
      <CustomPaper>
        <h3>Notes</h3>
        <List>
          {notes.map((note) => (
            <ListItem key={note.text}>
              <p>{note.text}</p>
            </ListItem>
          ))}
        </List>
        <Formik<{ text: string }>
          initialValues={{ text: '' }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            addClaimNote({
              variables: { id: claimId, note: { text: values.text } },
            })
            setSubmitting(false)
            resetForm()
          }}
        >
          <Form>
            <Field
              component={TextArea}
              placeholder="Type note content here"
              name="text"
            />
            <Button type="submit" variant="contained" color="primary">
              Add note
            </Button>
          </Form>
        </Formik>
      </CustomPaper>
    )}
  </Mutation>
)

export { Notes }
