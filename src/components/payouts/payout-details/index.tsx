import {
  Button as MuiButton,
  MenuItem as MuiMenuItem,
  withStyles,
} from '@material-ui/core'
import { Field, Form, Formik } from 'formik'
import * as React from 'react'
import * as yup from 'yup'
import { FieldSelect } from '../../shared/inputs/FieldSelect'
import { TextField } from '../../shared/inputs/TextField'

export interface PayoutProps {
  payoutDetails
  match: any
  payoutRequest: (payoutFormData: PayoutFormData, memberId: string) => void
}

export interface PayoutFormData {
  match: any
  memberId: string
  category: 'MARKETING' | 'REFERRAL' | 'REFUND'
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

class PayoutDetails extends React.Component<
  PayoutProps,
  { confirmed: boolean }
> {
  public state = {
    confirmed: false,
  }

  public render() {
    const { payoutDetails, match, payoutRequest } = this.props
    const memberId = match.params.id
    return (
      <Formik
        initialValues={{ category: '', amount: '', note: '', referenceId: '' }}
        onSubmit={(payoutFormData: any, { resetForm }) => {
          if (!this.state.confirmed) {
            return
          }
          payoutRequest(payoutFormData, memberId)
          resetForm()
          this.resetConfirmed()
        }}
        validationSchema={getPayoutValidationSchema()}
      >
        {({ isValid }) => (
          <Form onChange={this.resetConfirmed}>
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
            {!this.state.confirmed ? (
              <SubmitButton
                type="button"
                variant="contained"
                color="secondary"
                disabled={!isValid}
                onClick={(e) => {
                  e.preventDefault()
                  this.toggleConfirmed()
                }}
              >
                Confirm payout
              </SubmitButton>
            ) : (
              <SubmitButton
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isValid}
              >
                Create payout
              </SubmitButton>
            )}
          </Form>
        )}
      </Formik>
    )
  }

  private toggleConfirmed = () =>
    this.setState((state) => ({
      confirmed: !state.confirmed,
    }))

  private resetConfirmed = () => this.setState({ confirmed: false })
}

export default PayoutDetails
