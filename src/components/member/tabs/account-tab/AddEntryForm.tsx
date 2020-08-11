import { MenuItem, withStyles } from '@material-ui/core'
import { FormikDatePicker } from 'components/shared/inputs/DatePicker'
import { FieldSelect } from 'components/shared/inputs/FieldSelect'
import { TextField as MuiTextField } from 'components/shared/inputs/TextField'
import { startOfDay } from 'date-fns'
import { Field, Form as FormikForm, Formik } from 'formik'
import { useContractMarketInfo } from 'graphql/use-get-member-contract-market-info'
import React from 'react'
import styled from 'react-emotion'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { withShowNotification } from 'utils/notifications'
import * as yup from 'yup'

const TextField = withStyles({
  root: {
    display: 'block',
    width: '100%',
  },
})(MuiTextField)

const Form = styled(FormikForm)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

const getValidationSchema = () =>
  yup.object().shape({
    type: yup
      .string()
      .oneOf(['CAMPAIGN', 'SUBSCRIPTION', 'LOSS', 'CHARGE'])
      .required(),
    amount: yup.number().required(),
    reference: yup
      .string()
      .max(50)
      .required(),
    source: yup
      .string()
      .max(15)
      .required(),
    title: yup
      .string()
      .max(100)
      .nullable(true),
    comment: yup
      .string()
      .max(500)
      .nullable(true),
    fromDate: yup.date().min(startOfDay(new Date())),
  })

const AddEntryFormComponent: React.FC<{
  memberId: string
} & WithShowNotification> = ({ memberId, showNotification }) => {
  const [{ preferredCurrency }] = useContractMarketInfo(memberId)

  return (
    <Formik
      initialValues={{
        type: '',
        amount: '',
        reference: '',
        source: '',
        title: '',
        comment: '',
        fromDate: new Date(),
      }}
      onSubmit={() => void 0}
      validationSchema={getValidationSchema()}
    >
      {({ values, isValid }) => {
        return (
          <Form>
            <label htmlFor="type">Entry Type</label>
            <Field component={FieldSelect} name="type">
              <MenuItem value="CAMPAIGN">
                <strong>Campaign</strong>: The member owes/will owe us money but
                we want to pay for it with marketing budget
              </MenuItem>
              <MenuItem value="SUBSCRIPTION">
                <strong>Subscription</strong>: The member should owe us more
                money, e.g. object insurance, travel insurance, incorrectly
                fetched premiums
              </MenuItem>
              <MenuItem value="LOSS">
                <strong>Loss</strong>: The member owes us money we will never
                get, e.g. the member terminated its insurance or we had a too
                early start date
              </MenuItem>
              <MenuItem value="CORRECTION">
                <strong>Correction</strong>: A calculation is incorrect (should
                hopefully never have to be used)
              </MenuItem>
            </Field>
            <Field
              component={TextField}
              label="Amount"
              type="number"
              name="amount"
            />
            <Field
              component={TextField}
              label="Source"
              name="source"
              placeholder="(Required) This is where we look when we want to know the source, e.g. travel insurance, object insurance, marketing, IEX"
            />
            <Field
              component={TextField}
              label="Reference"
              name="reference"
              placeholder="(Required) This is what we look at when we want to know which source this is referring to, e.g. object insurance id, campaign code, member ID"
            />
            <Field
              component={TextField}
              label="Title"
              name="title"
              placeholder="(Optional) If this is to be shown in the app at a later point, this is the title of the entry"
            />
            <Field
              component={TextField}
              label="Comment"
              name="comment"
              placeholder="(Optional) Notes on what happened, maybe a calculation or statement on what happened"
            />
            <label htmlFor="fromDate">From Date</label>
            <Field component={FormikDatePicker} type="date" name="fromDate" />
          </Form>
        )
      }}
    </Formik>
  )
}

export const AddEntryForm = withShowNotification(AddEntryFormComponent)
