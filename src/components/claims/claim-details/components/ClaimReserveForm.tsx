import styled from '@emotion/styled'
import { Button as MuiButton, withStyles } from '@material-ui/core'
import { useUpdateReserveMutation } from 'api/generated/graphql'
import { Field, Form, Formik } from 'formik'
import * as React from 'react'
import * as yup from 'yup'

import { TextField } from '../../../shared/inputs/TextField'

interface Props {
  claimId: string
  refetch: () => Promise<any>
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

const ClaimReserveForm: React.FC<Props> = ({ claimId }) => {
  const [updateReserve] = useUpdateReserveMutation()

  return (
    <Formik<ReserveFormData>
      initialValues={{ amount: 0 }}
      onSubmit={async (values, { resetForm }) => {
        await updateReserve({
          variables: {
            claimId,
            amount: {
              amount: +values.amount,
              currency: 'SEK',
            },
          },
        })
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
  )
}

export { ClaimReserveForm }
