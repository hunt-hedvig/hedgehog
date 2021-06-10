import styled from '@emotion/styled'
import { Button as MuiButton, MenuItem as MuiMenuItem } from '@material-ui/core'
import {
  ClaimTypes,
  useClaimInformationQuery,
  useSetClaimInformationMutation,
  useSetClaimTypeMutation,
} from 'api/generated/graphql'
import Select from 'react-select'

import {
  PaperTitle,
  PaperTitleBadgeProps,
} from 'components/claims/claim-details/components/claim-items/PaperTitle'
import { FieldSelect } from 'components/shared/inputs/FieldSelect'
import { TextField } from 'components/shared/inputs/TextField'
import { Paper } from 'components/shared/Paper'
import { format, parseISO } from 'date-fns'
import { Field, Form, Formik } from 'formik'
import {
  DateTimePicker,
  FormikDateTimePicker,
} from 'hedvig-ui/date-time-picker'
import { Input } from 'hedvig-ui/input'
import { Loadable } from 'hedvig-ui/loadable'
import { Spinner } from 'hedvig-ui/sipnner'
import {
  ErrorText,
  Label,
  Paragraph,
  ThirdLevelHeadline,
} from 'hedvig-ui/typography'
import React, { useState } from 'react'
import { BugFill, ExclamationCircleFill } from 'react-bootstrap-icons'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { withShowNotification } from 'utils/notifications'
import { convertCamelcaseToTitle, getCarrierText } from 'utils/text'

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

const SubmitButton = MuiButton

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

const ClaimTypeOLDComponent: React.FC<ClaimTypeProps &
  WithShowNotification> = ({ claimId, memberId, showNotification }) => {
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
              location: typea?.location || '',
              date: type?.date ? parseISO(type.date) : null,
              item: type?.item || '',
              policeReport: type?.policeReport || '',
              receipt: type?.receipt || '',
              ticket: type?.ticket || '',
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

export const SearchableDropdown = styled(Select)`
  .searchable-type-select__control {
    margin-top: 1px;
    border-radius: 7px;
    height: 44px;
    box-shadow: none;
    background-color: ${({ theme }) => theme.backgroundLight};
    border: 1px solid ${({ theme }) => theme.border};
    font-size: 1rem;
  }

  .searchable-type-select__input {
    color: ${({ theme }) => theme.foreground};
    padding-left: 0px;
  }

  .searchable-type-select__menu {
    border-radius: 0;
    hyphens: auto;
    margin-top: 0px;
    text-align: left;
    word-wrap: break-word;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.foreground};
  }

  .searchable-type-select__option {
    &:hover {
      background: ${({ theme }) => theme.accentBackground};
    }
  }

  .searchable-type-select__value-container {
    padding-left: 16px;
    overflow: visible;
  }

  .searchable-type-select__multi-value__remove {
    display: none;
  }

  .searchable-type-select__single-value {
    color: ${({ theme }) => theme.foreground};
  }
`
const createClaimTypeOption = (claimType: string) => ({
  value: claimType,
  label: convertCamelcaseToTitle(claimType),
  searchTerms: claimType,
})

const ClaimTypeDataForm: React.FC<{ type: any }> = ({ type }) => {
  const [setClaimInformation] = useSetClaimInformationMutation()

  const [formData, setFormData] = useState({
    location: type?.location || '',
    date: type?.date ? parseISO(type.date) : null,
    item: type?.item || '',
    policeReport: type?.policeReport || '',
    receipt: type?.receipt || '',
    ticket: type?.ticket || '',
  })

  return (
    <>
      {hasLocation(type.__typename as ClaimTypes) && (
        <div style={{ marginTop: '1.0em' }}>
          <Label>Location</Label>
          <Input placeholder={'Any specific location?'} />
        </div>
      )}
      <div style={{ marginTop: '1.0em' }}>
        <Label>Date of Occurrence</Label>
        <DateTimePicker
          fullWidth={true}
          date={formData.date ?? new Date()}
          setDate={(newDate) => setFormData({ ...formData, date: newDate })}
        />
      </div>
      {hasItem(type.__typename as ClaimTypes) && (
        <div style={{ marginTop: '1.0em' }}>
          <Label>Item</Label>
          <Input placeholder={'Any specific item?'} />
        </div>
      )}
      {hasPoliceReport(type.__typename as ClaimTypes) && (
        <div style={{ marginTop: '1.0em' }}>
          <Label>Police report</Label>
          <Input placeholder={'Has a police report been filed?'} />
        </div>
      )}
      {hasReceipt(type.__typename as ClaimTypes) && (
        <div style={{ marginTop: '1.0em' }}>
          <Label>Receipt</Label>
          <Input placeholder={'Is there a receipt?'} />
        </div>
      )}
      {hasTicket(type.__typename as ClaimTypes) && (
        <div style={{ marginTop: '1.0em' }}>
          <Label>Ticket</Label>
          <Input placeholder={'Is there a ticket?'} />
        </div>
      )}
    </>
  )
}

const ClaimTypeComponent: React.FC<{
  claimId: string
  memberId: string
} & WithShowNotification> = ({ claimId, memberId, showNotification }) => {
  const {
    data: claimInformationData,
    loading: loadingClaimInformation,
    refetch,
    error: queryError,
  } = useClaimInformationQuery({
    variables: { claimId, memberId },
  })

  const [
    setClaimType,
    { loading: setClaimTypeLoading },
  ] = useSetClaimTypeMutation()

  const { contract, type } = claimInformationData?.claim ?? {}

  const titleBadge = (): PaperTitleBadgeProps | null => {
    if (queryError) {
      return {
        icon: BugFill,
        status: 'danger',
        label: 'Internal Error',
      }
    }
    if (!contract && !loadingClaimInformation) {
      return {
        icon: ExclamationCircleFill,
        status: 'warning',
        label: 'No contract set',
      }
    }

    return null
  }

  return (
    <Paper>
      <PaperTitle title={'Claim Type'} badge={titleBadge()} />
      <SearchableDropdown
        value={
          type?.__typename &&
          createClaimTypeOption(type?.__typename?.toString())
        }
        classNamePrefix="searchable-type-select"
        placeholder={'What type of claim is this?'}
        isLoading={setClaimTypeLoading || loadingClaimInformation}
        isClearable={true}
        isSearchable={true}
        onChange={(selection) => {
          setClaimType({
            variables: { id: claimId, type: selection?.value ?? null },
          })
            .then(() => {
              refetch()
            })
            .catch(() => {
              showNotification({
                header: 'Error',
                type: 'red',
                message: 'Something went wrong, notify the tech team',
              })
            })
        }}
        noOptionsMessage={() => 'No types found'}
        options={Object.keys(ClaimTypes).map((claimType) =>
          createClaimTypeOption(claimType),
        )}
      />
      {!!type && <ClaimTypeDataForm type={type} />}
    </Paper>
  )
}

export const ClaimTypeForm = withShowNotification(ClaimTypeComponent)
