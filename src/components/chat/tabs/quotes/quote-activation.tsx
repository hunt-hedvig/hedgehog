import { useMutation } from '@apollo/react-hooks'
import { Quote } from 'api/generated/graphql'
import { useState } from 'react'
import * as React from 'react'
import { gql } from 'apollo-boost'
import { BottomSpacerWrapper, ErrorMessage, SubmitButton } from './common'
import { QUOTES_QUERY } from './use-quotes'
import { BaseDatePicker } from 'components/shared/inputs/DatePicker'
import { Button, Checkbox } from 'semantic-ui-react'

const ACTIVATE_MUTATION = gql`
  mutation ActivateQuote(
    $id: ID!
    $activationDate: LocalDate!
    $terminationDate: LocalDate
  ) {
    activateQuote(
      id: $id
      activationDate: $activationDate
      terminationDate: $terminationDate
    ) {
      id
      originatingProductId
      signedProductId
    }
  }
`
export const QuoteActivation: React.FunctionComponent<{
  quote: Quote
  memberId
  onSubmitted?: () => void
  onWipChange?: (isWip: boolean) => void
}> = function({
  quote,
  memberId,
  onSubmitted = () => {},
  onWipChange = (_) => {},
}) {
  const [activationDate, setActivationDate] = useState<Date | null>(new Date())
  const [terminationDate, setTerminationDate] = useState<Date | null>(null)
  const [useGap, setUseGap] = useState(false)

  const [activateQuote, activationMutation] = useMutation(ACTIVATE_MUTATION, {
    refetchQueries: () => [
      {
        query: QUOTES_QUERY,
        variables: { memberId },
      },
    ],
  })

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        if (
          activationMutation.loading ||
          !activationDate ||
          !confirm('Are you sure you want to activate?')
        ) {
          return
        }
        await activateQuote({
          variables: {
            id: quote.id,
            activationDate: activationDate.toISOString().slice(0, 10),
            terminationDate: useGap
              ? terminationDate?.toISOString()?.slice(0, 10)
              : null,
          },
        })
        onSubmitted && onSubmitted()
      }}
    >
      <BottomSpacerWrapper>
        <div>
          <strong>Activation date</strong>
        </div>
        <div>
          <BaseDatePicker
            value={activationDate}
            onChange={(value) => {
              onWipChange && onWipChange(true)
              setActivationDate(value)
            }}
          />
        </div>
      </BottomSpacerWrapper>

      <BottomSpacerWrapper>
        <Checkbox
          onChange={(_, { checked }) => {
            onWipChange && onWipChange(true)
            if (!checked) {
              setTerminationDate(null)
            }
            setUseGap(checked!)
          }}
          label="Create gap between insurances"
          checked={useGap}
        />
      </BottomSpacerWrapper>

      {useGap && (
        <BottomSpacerWrapper>
          <div>
            <strong>Terminate current insurance at</strong>
          </div>
          <div>
            <BaseDatePicker
              value={terminationDate}
              onChange={(value) => {
                onWipChange && onWipChange(true)
                setTerminationDate(value)
              }}
              maxDate={activationDate}
            />
          </div>
        </BottomSpacerWrapper>
      )}

      {!activationMutation.data?.activateQuote ? (
        <SubmitButton type="submit" disabled={activationMutation.loading}>
          Activate
        </SubmitButton>
      ) : (
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            window.location.reload()
          }}
        >
          Reload
        </Button>
      )}

      {activationMutation.error && (
        <ErrorMessage>
          {JSON.stringify(activationMutation.error, null, 2)}
        </ErrorMessage>
      )}
    </form>
  )
}
