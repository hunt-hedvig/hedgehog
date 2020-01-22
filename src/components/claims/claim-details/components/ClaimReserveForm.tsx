import { Button as MuiButton, withStyles } from '@material-ui/core'
import { Field, Form, Formik } from 'formik'
import gql from 'graphql-tag'
import * as React from 'react'
import { Mutation } from 'react-apollo'
import styled from 'react-emotion'
import { sleep } from 'utils/sleep'
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
  refetchPage: () => Promise<void>
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

const ClaimReserveForm: React.SFC<Props> = ({ claimId, refetchPage }) => (
  <Mutation
    mutation={UPDATE_RESERVE_MUTATION}
    onError={(error) => {
      console.error(error)
      console.error('GraphQL error when trying to update the reserve')
    }}
  >
    {(updateReserve) => (
      <Formik<ReserveFormData>
        initialValues={{ amount: 0 }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          await updateReserve({
            variables: {
              id: claimId,
              amount: {
                amount: +values.amount,
                currency: 'SEK',
              },
            },
          })
          await sleep(1000)
          await refetchPage()
          setSubmitting(false)
          resetForm()
        }}
        validationSchema={validationSchema}
      >
        {({ isValid, isSubmitting }) => (
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
              disabled={!isValid || isSubmitting}
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
