import { Button, List, ListItem, TextField } from '@material-ui/core'
import { Field, FieldProps, Form, Formik } from 'formik'
import * as React from 'react'
import { CustomPaper } from './Styles'

interface Note {
  text: string
}

interface Props {
  notes: Note[]
  addClaimNote: (note: string) => void
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

const Notes: React.SFC<Props> = ({ notes, addClaimNote }) => (
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
        addClaimNote(values.text)
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
)

export { Notes }
