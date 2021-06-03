import styled from '@emotion/styled'
import { Button as MuiButton, MenuItem as MuiMenuItem } from '@material-ui/core'
import {
  ClaimTypes,
  useClaimInformationQuery,
  useSetClaimInformationMutation,
  useSetClaimTypeMutation,
} from 'api/generated/graphql'

import { FieldSelect } from 'components/shared/inputs/FieldSelect'
import { TextField } from 'components/shared/inputs/TextField'
import { Paper } from 'components/shared/Paper'
import { format, parseISO } from 'date-fns'
import { Field, Form, Formik } from 'formik'
import { FormikDateTimePicker } from 'hedvig-ui/date-time-picker'
import { Loadable } from 'hedvig-ui/loadable'
import { Spinner } from 'hedvig-ui/sipnner'
import { ErrorText, Paragraph, ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { withShowNotification } from 'utils/notifications'
import { getCarrierText } from 'utils/text'

const hasLocation = (typename: ClaimTypes): boolean => {
  return [
    ClaimTypes.TheftClaim,
    ClaimTypes.AccidentalDamageClaim,
    ClaimTypes.AssaultClaim,
    ClaimTypes.TravelAccidentClaim,
    ClaimTypes.LuggageDelayClaim,
    ClaimTypes.LiabilityClaim,
    ClaimTypes.FireDamageClaim,
    ClaimTypes.ApplianceClaim,
    ClaimTypes.BurglaryClaim,
    ClaimTypes.InstallationsClaim,
  ].includes(typename)
}

const hasItem = (typename: ClaimTypes): boolean => {
  return [
    ClaimTypes.TheftClaim,
    ClaimTypes.AccidentalDamageClaim,
    ClaimTypes.ApplianceClaim,
    ClaimTypes.BurglaryClaim,
    ClaimTypes.InstallationsClaim,
  ].includes(typename)
}

const hasPoliceReport = (typename: ClaimTypes): boolean => {
  return [
    ClaimTypes.TheftClaim,
    ClaimTypes.AccidentalDamageClaim,
    ClaimTypes.AssaultClaim,
    ClaimTypes.TravelAccidentClaim,
    ClaimTypes.BurglaryClaim,
  ].includes(typename)
}

const hasReceipt = (typename: ClaimTypes): boolean => {
  return [
    ClaimTypes.AccidentalDamageClaim,
    ClaimTypes.TravelAccidentClaim,
    ClaimTypes.BurglaryClaim,
  ].includes(typename)
}

const hasTicket = (typename: ClaimTypes): boolean => {
  return typename === ClaimTypes.LuggageDelayClaim
}

interface ClaimTypeProps {
  claimId: string
  memberId: string
}

const Label = styled.label`
  display: block;
`

const SubmitButton = MuiButton

const ClaimTypeInformationForm = styled(Form)({
  marginTop: '1rem',
})

const handleError = (showNotification: (data: any) => void) => () => {
  showNotification({
    type: 'error',
    message: 'Something went wrong, notify the tech team plz',
    headline: '):',
  })
}

const DangerParagraph = styled(Paragraph)`
  color: ${({ theme }) => theme.danger};
`

const ClaimTypeComponent: React.FC<ClaimTypeProps & WithShowNotification> = ({
  claimId,
  memberId,
  showNotification,
}) => {
  const [isSetClaimTypeLoading, setSetClaimTypeLoading] = React.useState(false)
  const {
    data: claimInformationData,
    refetch: refetchClaimInformation,
    loading: loadingClaimInformation,
    error: queryError,
  } = useClaimInformationQuery({
    variables: { claimId, memberId },
  })
  const [setClaimType, setClaimTypeProps] = useSetClaimTypeMutation({
    onError: handleError(showNotification),
  })
  const [
    setClaimInformation,
    setClaimInformationProps,
  ] = useSetClaimInformationMutation({ onError: handleError(showNotification) })

  const { contract, type } = claimInformationData?.claim ?? {}
  const typeAny: any = type
  const claimTypeType = type?.__typename as ClaimTypes

  return (
    <Paper>
      <ThirdLevelHeadline>Claim Type</ThirdLevelHeadline>

      {queryError && <ErrorText>{queryError.message}</ErrorText>}

      <Loadable loading={loadingClaimInformation}>
        {!contract && !loadingClaimInformation && (
          <DangerParagraph>⚠️ No contract set</DangerParagraph>
        )}
        <Formik<{ selectedType?: ClaimTypes | '' }>
          enableReinitialize
          initialValues={{
            selectedType: claimTypeType || '',
          }}
          onSubmit={async (values) => {
            if (!values.selectedType) {
              return
            }
            setSetClaimTypeLoading(true)
            await setClaimType({
              variables: { id: claimId, type: values.selectedType },
            })
            await refetchClaimInformation()
            setSetClaimTypeLoading(false)
          }}
        >
          {({ isValid }) => (
            <Form>
              <div>
                <Field component={FieldSelect} name="selectedType">
                  <MuiMenuItem disabled value="">
                    Select a type...
                  </MuiMenuItem>
                  {Object.keys(ClaimTypes).map((t) => (
                    <MuiMenuItem key={t} value={t}>
                      {t}
                    </MuiMenuItem>
                  ))}
                </Field>
              </div>
              <div>
                <SubmitButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={
                    !isValid ||
                    setClaimTypeProps.loading ||
                    isSetClaimTypeLoading
                  }
                >
                  Set type
                  {(setClaimTypeProps.loading || isSetClaimTypeLoading) && (
                    <Spinner push="left" />
                  )}
                </SubmitButton>
              </div>
            </Form>
          )}
        </Formik>
        {type ? (
          <Formik<{
            location?: string
            date: Date | null
            item?: string
            policeReport?: string
            receipt?: string
            ticket?: string
          }>
            initialValues={{
              location: typeAny?.location || '',
              date: typeAny?.date ? parseISO(typeAny.date) : null,
              item: typeAny?.item || '',
              policeReport: typeAny?.policeReport || '',
              receipt: typeAny?.receipt || '',
              ticket: typeAny?.ticket || '',
            }}
            onSubmit={async (values) => {
              await setClaimInformation({
                variables: {
                  id: claimId,
                  claimInformation: {
                    ...values,
                    date: values.date && format(values.date, 'yyyy-MM-dd'),
                  },
                },
              })
            }}
          >
            {({ isValid }) => (
              <ClaimTypeInformationForm>
                {hasLocation(claimTypeType) && (
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Field
                      component={TextField}
                      name="location"
                      id="location"
                      placeholder="Location"
                    />
                  </div>
                )}
                <div>
                  {claimInformationData?.claim?.agreement?.carrier &&
                    getCarrierText(
                      claimInformationData.claim.agreement.carrier,
                    )}
                  <Label htmlFor="date">Date of Occurrence</Label>
                  <Field
                    component={FormikDateTimePicker}
                    name="date"
                    id="date"
                    placeholder="Date"
                  />
                </div>
                {hasItem(claimTypeType) && (
                  <div>
                    <Label htmlFor="item">Item</Label>
                    <Field
                      component={TextField}
                      name="item"
                      id="item"
                      placeholder="Item"
                    />
                  </div>
                )}
                {hasPoliceReport(claimTypeType) && (
                  <div>
                    <Label htmlFor="police-report">Police report</Label>
                    <Field
                      component={TextField}
                      name="policeReport"
                      id="police-report"
                      placeholder="Police Report"
                    />
                  </div>
                )}
                {hasReceipt(claimTypeType) && (
                  <div>
                    <Label htmlFor="receipt">Receipt</Label>
                    <Field
                      component={TextField}
                      name="receipt"
                      id="receipt"
                      placeholder="Receipt"
                    />
                  </div>
                )}
                {hasTicket(claimTypeType) && (
                  <div>
                    <Label htmlFor="ticket">Ticket</Label>
                    <Field
                      component={TextField}
                      name="ticket"
                      id="ticket"
                      placeholder="Ticket"
                    />
                  </div>
                )}
                <div>
                  <SubmitButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={
                      !isValid ||
                      setClaimInformationProps.loading ||
                      isSetClaimTypeLoading
                    }
                  >
                    Update claim information
                    {setClaimInformationProps.loading && (
                      <Spinner push="left" />
                    )}
                  </SubmitButton>
                </div>
              </ClaimTypeInformationForm>
            )}
          </Formik>
        ) : null}
      </Loadable>
    </Paper>
  )
}

export const ClaimTypeForm = withShowNotification(ClaimTypeComponent)
