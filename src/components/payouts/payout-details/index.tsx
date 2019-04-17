import {
  Button as MuiButton,
  MenuItem as MuiMenuItem,
  withStyles,
} from '@material-ui/core'
import { Field, FieldProps, Form, Formik, validateYupSchema } from 'formik'
import * as React from 'react'
import { Payout } from 'store/types/payoutTypes'
import * as yup from 'yup'
import { FieldSelect } from '../../shared/inputs/FieldSelect'
import { TextField } from '../../shared/inputs/TextField'

export interface PayoutProps {
  data: any
  payoutRequest: (payoutFormData: any, memberId: string) => void
  payoutRequestSuccess: (payout: Payout) => void
  payoutRequestError: (error: any) => void
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
  match,
  data,
  payoutRequest,
  payoutRequestSuccess, // TODO: REMOVE
  payoutRequestError,
}) => {
  return (
    <Formik
      initialValues={{ category: '', amount: '', note: '', referenceId: '' }}
      onSubmit={(payoutFormData: any, { setSubmitting }) => {
        payoutRequest(payoutFormData, match.params.id)
        setSubmitting(false)
      }}
      validationSchema={getPayoutValidationSchema()}
    >
      {({ resetForm, isValid }) => (
        <Form>
          <Field
            component={TextField}
            placeholder="Payment amount"
            name="amount"
          />
          <Field component={FieldSelect} name="category">
            <MuiMenuItem value="MARKETING">Marketing</MuiMenuItem>
            <MuiMenuItem value="REFERRAL">Referral</MuiMenuItem>
            <MuiMenuItem value="REFUND">Refund</MuiMenuItem>
          </Field>
          <Field
            component={TextField}
            placeholder="Reference Id"
            name="referenceId"
          />
          <Field component={TextField} placeholder="Note" name="note" />
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

/*
<Formik
      initialValues={{ category: '', amount: '', note: '', refernceId: '' }}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values)
        setSubmitting(false)
      }}
    >
      {({ resetForm, isValid }) => (
        <Form>
          <Field
            component={TextField}
            placeholder="Payment amount"
            name="amount"
          />
          <Field component={FieldSelect} name="category">
            <MuiMenuItem value="MARKETING">Marketing</MuiMenuItem>
            <MuiMenuItem value="REFERRAL">Referral</MuiMenuItem>
            <MuiMenuItem value="REFUND">Refund</MuiMenuItem>
          </Field>
          <Field
            component={TextField}
            placeholder="Reference Id"
            name="referenceId"
          />
          <Field component={TextField} placeholder="Note" name="note" />
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
 */
