import { Button as MuiButton, withStyles } from '@material-ui/core'
import { Field, Form, Formik } from 'formik'
import gql from 'graphql-tag'
import * as React from 'react'
import { Mutation } from 'react-apollo'
import styled from 'react-emotion'
import * as yup from 'yup'

import { TextField } from '../../../shared/inputs/TextField'

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

interface ReserveFormData {
  amount: number
}

const validationSchema = yup.object().shape({
  amount: yup.string().required(),
})

const ReserveForm = styled(Form)({})

const SubmitButton = withStyles({
  root: {
    marginTop: '1rem',
  },
})(MuiButton)

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
        validationSchema={validationSchema}
      >
        {({ isValid }) => (
          <ReserveForm>
            <Field
              component={TextField}
              placeholder={'Reserve amount'}
              name="amount"
            />
            <SubmitButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isValid}
            >
              Update Reserve
            </SubmitButton>
          </ReserveForm>
        )}
      </Formik>
    )}
  </Mutation>
)

export { ClaimReserveForm }
