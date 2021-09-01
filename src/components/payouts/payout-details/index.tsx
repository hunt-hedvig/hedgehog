import { ApolloCache } from '@apollo/client'
import styled from '@emotion/styled'
import {
  Button as MuiButton,
  MenuItem as MuiMenuItem,
  withStyles,
} from '@material-ui/core'
import {
  GetMemberTransactionsDocument,
  GetMemberTransactionsQuery,
  PayoutMemberMutation,
  usePayoutMemberMutation,
} from 'api/generated/graphql'
import { Field, Form, Formik } from 'formik'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import * as yup from 'yup'
import { FieldSelect } from '../../shared/inputs/FieldSelect'
import { TextField } from '../../shared/inputs/TextField'

const SubmitButton = withStyles({
  root: {
    marginTop: '1rem',
    display: 'block',
  },
})(MuiButton)

const VerticalForm = styled(Form)`
  display: flex;
  flex-direction: column;
`

const getPayoutValidationSchema = () =>
  yup.object().shape({
    amount: yup.number().required(),
    category: yup
      .string()
      .oneOf(['MARKETING', 'REFERRAL', 'REFUND'])
      .required(),
    referenceId: yup.string().required(),
  })

export const PayoutDetails: React.FC<{ memberId: string }> = ({ memberId }) => {
  const [confirmed, setConfirmed] = useState(false)
  const [payoutMember] = usePayoutMemberMutation()

  const updateCache = (
    cache: ApolloCache<any>,
    response: PayoutMemberMutation,
  ) => {
    const transaction = response?.payoutMember
    const cachedData = cache.readQuery({
      query: GetMemberTransactionsDocument,
      variables: { id: memberId },
    })

    const member = (cachedData as GetMemberTransactionsQuery).member
    const transactions = member?.transactions ?? []

    const newMember = {
      ...member,
      transactions: [...transactions, transaction],
    }

    cache.writeQuery({
      query: GetMemberTransactionsDocument,
      data: { member: newMember },
    })
  }

  return (
    <Formik
      initialValues={{ category: '', amount: '', note: '', referenceId: '' }}
      onSubmit={(data: any, { resetForm }) => {
        if (!confirmed) {
          return
        }

        toast.promise(
          payoutMember({
            variables: {
              memberId,
              request: {
                amount: {
                  amount: data.amount,
                  currency: 'SEK',
                },
                category: data.category,
                referenceId: data.referenceId,
                note: data.note,
              },
            },
            update: (cache, { data: response }) => {
              if (!response) {
                return
              }
              updateCache(cache, response)
            },
          }),
          {
            loading: 'Creating payout...',
            success: () => {
              resetForm()
              setConfirmed(false)
              return 'Payout created'
            },
            error: 'Could not create payout',
          },
        )
      }}
      validationSchema={getPayoutValidationSchema()}
    >
      {({ isValid }) => (
        <VerticalForm onChange={() => setConfirmed(false)}>
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
          {!confirmed ? (
            <SubmitButton
              type="button"
              variant="contained"
              color="secondary"
              disabled={!isValid}
              onClick={(e) => {
                e.preventDefault()
                setConfirmed((currentConfirmed) => !currentConfirmed)
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
        </VerticalForm>
      )}
    </Formik>
  )
}
