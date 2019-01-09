import {
  Button as MuiButton,
  MenuItem as MuiMenuItem,
  withStyles,
} from '@material-ui/core'
import format from 'date-fns/format'
import toDate from 'date-fns/toDate'
import { Field, Form, Formik } from 'formik'
import gql from 'graphql-tag'
import * as React from 'react'
import { Mutation } from 'react-apollo'
import styled from 'react-emotion'

import { DatePicker } from '../../../shared/inputs/DatePicker'
import { FieldSelect } from '../../../shared/inputs/FieldSelect'
import { TextField } from '../../../shared/inputs/TextField'
import { Paper } from '../../../shared/Paper'

export const TYPE_FRAGMENT = `
        __typename
        ... on TheftClaim {
          location
          date
          item
          policeReport
          receipt
        }
        ... on AccidentalDamageClaim {
          location
          date
          item
          policeReport
          receipt
        }
        ... on AssaultClaim {
          location
          date
          policeReport
        }
        ... on WaterDamageClaim {
          date
        }
        ... on TravelAccidentClaim {
          location
          date
          policeReport
          receipt
        }
        ... on LuggageDelayClaim {
          location
          date
          ticket
        }
        ... on NotCoveredClaim {
          date
        }
        ... on ConfirmedFraudClaim {
          date
        }
        ... on TestClaim {
          date
        }
        ... on LiabilityClaim {
          date
          location
        }
`

const SET_CLAIM_TYPE_QUERY = gql`
  query SetClaimType($id: ID!) {
    claim(id: $id) {
      type {
        ${TYPE_FRAGMENT}
      }
      events {
        text
        date
      }
    }
  }
`

const SET_CLAIM_TYPE_MUTATION = gql`
  mutation SetClaimType($id: ID!, $type: ClaimTypes!) {
    setClaimType(id: $id, type: $type) {
      type {
        ${TYPE_FRAGMENT}
      }
      events {
        text
        date
      }
    }
  }
`

const SET_CLAIM_INFORMATION = gql`
  mutation SetClaimInformation($id: ID!, $claimInformation: ClaimInformationInput!) {
    setClaimInformation(id: $id, information: $claimInformation) {
      type {
        ${TYPE_FRAGMENT}
      }
      events {
        text
        date
      }
    }
  }
`

const SET_CLAIM_INFORMATION_QUERY = gql`
  query SetClaimInformation($id: ID!) {
    claim(id: $id) {
      type {
        ${TYPE_FRAGMENT}
      }
      events {
        text
        date
      }
    }
  }
`

const hasLocation = (typename: ClaimTypes): boolean => {
  return [
    ClaimTypes.TheftClaim,
    ClaimTypes.AccidentalDamageClaim,
    ClaimTypes.AssaultClaim,
    ClaimTypes.TravelAccidentClaim,
    ClaimTypes.LuggageDelayClaim,
    ClaimTypes.LiabilityClaim,
  ].includes(typename)
}

const hasItem = (typename: ClaimTypes): boolean => {
  return [ClaimTypes.TheftClaim, ClaimTypes.AccidentalDamageClaim].includes(
    typename,
  )
}

const hasPoliceReport = (typename: ClaimTypes): boolean => {
  return [
    ClaimTypes.TheftClaim,
    ClaimTypes.AccidentalDamageClaim,
    ClaimTypes.AssaultClaim,
    ClaimTypes.TravelAccidentClaim,
  ].includes(typename)
}

const hasReceipt = (typename: ClaimTypes): boolean => {
  return [
    ClaimTypes.AccidentalDamageClaim,
    ClaimTypes.TravelAccidentClaim,
  ].includes(typename)
}

const hasTicket = (typename: ClaimTypes): boolean => {
  return typename === ClaimTypes.LuggageDelayClaim
}

interface TheftClaim {
  location?: string
  date?: string
  item?: string
  policeReport?: string
  __typename: ClaimTypes
}

interface AccidentalDamageClaim {
  location?: string
  date?: string
  item?: string
  policeReport?: string
  receipt?: string
  __typename: ClaimTypes
}

interface AssaultClaim {
  location?: string
  date?: string
  policeReport?: string
  __typename: ClaimTypes
}

interface WaterDamageClaim {
  date?: string
  __typename: ClaimTypes
}

interface TravelAccidentClaim {
  location?: string
  date?: string
  policeReport?: string
  receipt?: string
  __typename: ClaimTypes
}

interface LuggageDelayClaim {
  location?: string
  date?: string
  ticket?: string
  __typename: ClaimTypes
}

interface NotCoveredClaim {
  date?: string
  __typename: ClaimTypes
}

interface TestClaim {
  date?: string
  __typename: ClaimTypes
}

interface ConfirmedFraudClaim {
  date?: string
  __typename: ClaimTypes
}

interface LiabilityClaim {
  date?: string
  location?: string
  __typename: ClaimTypes
}

export enum ClaimTypes {
  TheftClaim = 'TheftClaim',
  AccidentalDamageClaim = 'AccidentalDamageClaim',
  AssaultClaim = 'AssaultClaim',
  WaterDamageClaim = 'WaterDamageClaim',
  TravelAccidentClaim = 'TravelAccidentClaim',
  LuggageDelayClaim = 'LuggageDelayClaim',
  NotCoveredClaim = 'NotCoveredClaim',
  LiabilityClaim = 'LiabilityClaim',
  ConfirmedFraudClaim = 'ConfirmedFraudClaim',
  TestClaim = 'TestClaim',
}

type ClaimType =
  | TheftClaim
  | AccidentalDamageClaim
  | AssaultClaim
  | WaterDamageClaim
  | TravelAccidentClaim
  | LuggageDelayClaim
  | NotCoveredClaim
  | LiabilityClaim
  | ConfirmedFraudClaim
  | TestClaim

interface ClaimTypeProps {
  type?: ClaimType
  claimId: string
}

const SubmitButton = withStyles({
  root: {
    marginTop: '1rem',
  },
})(MuiButton)

const ClaimTypeInformationForm = styled(Form)({
  marginTop: '1rem',
})

const ClaimType: React.SFC<ClaimTypeProps> = ({ type, claimId }) => (
  <Mutation
    mutation={SET_CLAIM_TYPE_MUTATION}
    update={(cache, { data: updateData }) => {
      cache.writeQuery({
        query: SET_CLAIM_TYPE_QUERY,
        variables: { id: claimId },
        data: {
          claim: {
            type: updateData.setClaimType.type,
            events: updateData.setClaimType.events,
            __typename: updateData.setClaimType.__typename,
          },
        },
      })
    }}
  >
    {(setClaimType) => (
      <Mutation
        mutation={SET_CLAIM_INFORMATION}
        update={(cache, { data: updateData }) => {
          cache.writeQuery({
            query: SET_CLAIM_INFORMATION_QUERY,
            variables: { id: claimId },
            data: {
              claim: {
                type: updateData.setClaimInformation.type,
                events: updateData.setClaimInformation.events,
                __typename: updateData.setClaimInformation.__typename,
              },
            },
          })
        }}
      >
        {(setClaimInformation) => (
          <Paper>
            <h3>Type</h3>
            <Formik<{ selectedType?: ClaimTypes | '' }>
              initialValues={{ selectedType: (type && type.__typename) || '' }}
              onSubmit={(values, { setSubmitting }) => {
                if (!values.selectedType) {
                  return
                }
                setClaimType({
                  variables: { id: claimId, type: values.selectedType },
                })
                setSubmitting(false)
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
                      disabled={!isValid}
                    >
                      Set type
                    </SubmitButton>
                  </div>
                </Form>
              )}
            </Formik>
            {type ? (
              <Formik<{
                location?: string
                date?: Date
                item?: string
                policeReport?: string
                receipt?: string
                ticket?: string
              }>
                initialValues={{
                  location: (type as any).location || '',
                  date: type.date ? toDate(type.date) : undefined,
                  item: (type as any).item || '',
                  policeReport: (type as any).policeReport || '',
                  receipt: (type as any).receipt || '',
                  ticket: (type as any).ticket || '',
                }}
                onSubmit={(values, { setSubmitting }) => {
                  setClaimInformation({
                    variables: {
                      id: claimId,
                      claimInformation: {
                        ...values,
                        date: values.date && format(values.date, 'yyyy-MM-dd'),
                      },
                    },
                  })
                  setSubmitting(false)
                }}
              >
                {({ isValid, values }) =>
                  !console.log(values) && (
                    <ClaimTypeInformationForm>
                      {hasLocation(type.__typename) && (
                        <div>
                          <Field
                            component={TextField}
                            name="location"
                            placeholder="Location"
                          />
                        </div>
                      )}
                      <div>
                        <Field
                          component={DatePicker}
                          name="date"
                          placeholder="Date"
                        />
                      </div>
                      {hasItem(type.__typename) && (
                        <div>
                          <Field
                            component={TextField}
                            name="item"
                            placeholder="Item"
                          />
                        </div>
                      )}
                      {hasPoliceReport(type.__typename) && (
                        <div>
                          <Field
                            component={TextField}
                            name="policeReport"
                            placeholder="Police Report"
                          />
                        </div>
                      )}
                      {hasReceipt(type.__typename) && (
                        <div>
                          <Field
                            component={TextField}
                            name="receipt"
                            placeholder="Receipt"
                          />
                        </div>
                      )}
                      {hasTicket(type.__typename) && (
                        <div>
                          <Field
                            component={TextField}
                            name="ticket"
                            placeholder="Ticket"
                          />
                        </div>
                      )}
                      <div>
                        <SubmitButton
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={!isValid}
                        >
                          Update claim information
                        </SubmitButton>
                      </div>
                    </ClaimTypeInformationForm>
                  )
                }
              </Formik>
            ) : null}
          </Paper>
        )}
      </Mutation>
    )}
  </Mutation>
)

export { ClaimType }
