import {
  Button,
  Select as MuiSelect,
  TextField as MuiTextField,
} from '@material-ui/core'
import { Field, FieldProps, Form, Formik } from 'formik'
import gql from 'graphql-tag'
import * as React from 'react'
import { Mutation } from 'react-apollo'
import styled from 'react-emotion'
import * as yup from 'yup'

const UPDATE_RESERVE_MUTATION = gql`
  mutation UpdateReserve($id: ID!, $amount: MonetaryAmount!) {
    updateReserve(id: $id, amount: $amount) {
      reserves
      events {
        text
        date
      }
    }
  }
`

const UPDATE_RESERVE_QUERY = gql`
  query UpdateReserveQuery($id: ID!) {
    claim(id: $id) {
      reserves
      events {
        text
        date
      }
    }
  }
`

interface Props {
  claimId: string
}

interface TextFieldProps {
  placeholder: string
}

interface ReserveFormData {
  amount: number
}

export const TextField: React.SFC<FieldProps & TextFieldProps> = ({
  field: { onChange, onBlur, name, value },
  placeholder,
}) => (
  <MuiTextField
    onChange={onChange}
    onBlur={onBlur}
    name={name}
    value={value || ''}
    placeholder={placeholder}
    autoComplete="off"
  />
)

const schema = yup.object().shape({
  amount: yup.string().required(),
})

const ReserveForm = styled(Form)({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '20px',
  marginBottom: '20px',
})

const ClaimReserveForm: React.SFC<Props> = ({ claimId }) => (
  <Mutation
    mutation={UPDATE_RESERVE_MUTATION}
    update={(cache, { data: updateData }) => {
      cache.writeQuery({
        query: UPDATE_RESERVE_QUERY,
        variables: { id: claimId },
        data: {
          claim: {
            reserves: updateData.updateReserve.reserves,
            events: updateData.updateReserve.events,
          },
        },
      })
    }}
    onError={(error) => {
      console.error(error)
      console.error('GraphQL error when trying to update the reserve')
    }}
  >
    {(updateReserve) => (
      <Formik<ReserveFormData>
        initialValues={{ amount: 0 }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          updateReserve({
            variables: {
              id: claimId,
              amount: {
                amount: +values.amount,
                currency: 'SEK',
              },
            },
          })
          setSubmitting(false)
          resetForm()
        }}
        validationSchema={schema}
      >
        <ReserveForm>
          <Field
            component={TextField}
            placeholder={'Reserve amount'}
            name="amount"
          />
          <Button type="submit" color="primary">
            Update Reserve
          </Button>
        </ReserveForm>
      </Formik>
    )}
  </Mutation>
)

export { ClaimReserveForm }
