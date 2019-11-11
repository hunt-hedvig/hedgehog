import { useMutation } from '@apollo/react-hooks'
import { useState } from 'react'
import * as React from 'react'
import { gql } from 'apollo-boost'
import { BottomSpacerWrapper, ErrorMessage, SubmitButton } from './common'
import { QuoteData, QuoteResponseEntity } from './data'
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
  quote: QuoteResponseEntity<QuoteData>
  memberId
  onSubmitted?: () => void
  onWipChange?: (isWip: boolean) => void
}> = function({
  quote,
  memberId,
  onSubmitted = () => {},
  onWipChange = (_) => {},
}) {
  const [activationDate, setActivationDate] = useState<Date | null>(null)
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
        if (activationMutation.loading || !activationDate) {
          return
        }
        await activateQuote({
          variables: {
            id: quote.id,
            activationDate: activationDate.toISOString().slice(0, 10),
            terminationDate: terminationDate?.toISOString()?.slice(0, 10),
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
          onChange={(e) => {
            onWipChange && onWipChange(true)
            const newUseGap = !useGap
            if (!newUseGap) {
              setTerminationDate(null)
            }
            setUseGap(newUseGap)
          }}
          label="Create gap between insurances"
          value={useGap}
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
          Do activate quote
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
