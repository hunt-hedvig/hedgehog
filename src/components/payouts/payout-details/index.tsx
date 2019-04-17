import {
  Button as MuiButton,
  MenuItem as MuiMenuItem,
  withStyles,
} from '@material-ui/core'
import { Field, Form, Formik } from 'formik'
import * as React from 'react'
import { PayoutRequestResult } from 'store/types/payoutTypes'
import * as yup from 'yup'
import { FieldSelect } from '../../shared/inputs/FieldSelect'
import { TextField } from '../../shared/inputs/TextField'

export interface PayoutProps {
  payoutDetails
  match: any
  payoutRequest: (payoutFormData: any, memberId: string) => void
}

export interface PayoutFormData {
  match: any
  memberId: string
  category: string
  amount: string
  note: string
  referenceId: string
}

const SubmitButton = withStyles({
  root: {
    marginTop: '1rem',
    display: 'block',
  },
})(MuiButton)

const getPayoutValidationSchema = () =>
  yup.object().shape({
    amount: yup.number().required(),
    category: yup
      .string()
      .oneOf(['MARKETING', 'REFERRAL', 'REFUND'])
      .required(),
    referenceId: yup.string().required(),
  })

const PayoutDetails: React.SFC<PayoutProps> = ({
  payoutDetails,
  match,
  payoutRequest,
}) => {
  const memberId = match.params.id
  return (
    <Formik
      initialValues={{ category: '', amount: '', note: '', referenceId: '' }}
      onSubmit={(payoutFormData: any, { resetForm }) => {
        payoutRequest(payoutFormData, memberId)
        resetForm()
      }}
      validationSchema={getPayoutValidationSchema()}
    >
      {({ isValid }) => (
        <Form>
          <Field component={FieldSelect} name="category">
            <MuiMenuItem value="MARKETING">Marketing</MuiMenuItem>
            <MuiMenuItem value="REFERRAL">Referral</MuiMenuItem>
            <MuiMenuItem value="REFUND">Refund</MuiMenuItem>
          </Field>
          <Field component={TextField} label="Payout amount" name="amount" />
          <Field
            component={TextField}
            label="Reference Id"
            name="referenceId"
          />

          <Field component={TextField} label="Note" name="note" />
          <SubmitButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isValid}
          >
            Create payout
          </SubmitButton>
        </Form>
      )}
    </Formik>
  )
}

export default PayoutDetails
