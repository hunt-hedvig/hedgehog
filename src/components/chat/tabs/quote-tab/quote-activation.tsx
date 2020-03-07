import { useMutation } from '@apollo/react-hooks'
import { Quote } from 'api/generated/graphql'
import { gql } from 'apollo-boost'
import { BaseDatePicker } from 'components/shared/inputs/DatePicker'
import { Button } from 'hedvig-ui/button'
import * as React from 'react'
import { Checkbox } from 'semantic-ui-react'
import { noopFunction } from 'utils'
import { QUOTES_QUERY } from '../../../../hooks/use-quotes'
import { BottomSpacerWrapper, ErrorMessage } from './common'

const ACTIVATE_MUTATION = gql`
  mutation AddAgreementFromQuote(
    $id: ID!
    $contractId: ID!
    $activeFrom: LocalDate
    $activeTo: LocalDate
    $previousAgreementActiveTo: LocalDate
  ) {
    addAgreementFromQuote(
      id: $id
      contractId: $contractId
      activeFrom: $activeFrom
      activeTo: $activeTo
      previousAgreementActiveTo: $previousAgreementActiveTo
    ) {
      id
      originatingProductId
      signedProductId
    }
  }
`
export const QuoteActivation: React.FC<{
  quote: Quote
  memberId
  onSubmitted?: () => void
  onWipChange?: (isWip: boolean) => void
}> = ({
  quote,
  memberId,
  onSubmitted = noopFunction,
  onWipChange = noopFunction,
}) => {
  const [activeFrom, setActiveFromDate] = React.useState<Date | null>(
    new Date(),
  )
  const [
    previousAgreementActiveTo,
    setPreviousAgreementActiveToDate,
  ] = React.useState<Date | null>(null)
  const [useGap, setUseGap] = React.useState(false)

  const [addAgreementFromQuote, addAgreementFromQuoteMutation] = useMutation(
    ACTIVATE_MUTATION,
    {
      refetchQueries: () => [
        {
          query: QUOTES_QUERY,
          variables: { memberId },
        },
      ],
    },
  )

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        if (
          addAgreementFromQuoteMutation.loading ||
          !activeFrom ||
          !confirm('Are you sure you want to activate?')
        ) {
          return
        }
        await addAgreementFromQuote({
          variables: {
            id: quote.id,
            contractId: null,
            activeFrom: activeFrom.toISOString().slice(0, 10),
            activeTo: null,
            previousAgreementActiveTo: useGap
              ? previousAgreementActiveTo?.toISOString()?.slice(0, 10)
              : null,
          },
        })
        if (onSubmitted) {
          onSubmitted()
        }
      }}
    >
      <BottomSpacerWrapper>
        <div>
          <strong>Active from</strong>
        </div>
        <div>
          <BaseDatePicker
            value={activeFrom}
            onChange={(value) => {
              if (onWipChange) {
                onWipChange(true)
              }
              setActiveFromDate(value)
            }}
          />
        </div>
      </BottomSpacerWrapper>

      <BottomSpacerWrapper>
        <Checkbox
          onChange={(_, { checked }) => {
            if (onWipChange) {
              onWipChange(true)
            }
            if (!checked) {
              setPreviousAgreementActiveToDate(null)
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
            <strong>Previous agreement active to</strong>
          </div>
          <div>
            <BaseDatePicker
              value={previousAgreementActiveTo}
              onChange={(value) => {
                if (onWipChange) {
                  onWipChange(true)
                }
                setPreviousAgreementActiveToDate(value)
              }}
              maxDate={activeFrom}
            />
          </div>
        </BottomSpacerWrapper>
      )}

      {!addAgreementFromQuoteMutation.data?.activateQuote ? (
        <Button
          variation="success"
          type="submit"
          fullWidth
          disabled={addAgreementFromQuoteMutation.loading}
        >
          Activate
        </Button>
      ) : (
        <Button
          variation="primary"
          fullWidth
          onClick={(e) => {
            e.preventDefault()
            window.location.reload()
          }}
        >
          Reload
        </Button>
      )}

      {addAgreementFromQuoteMutation.error && (
        <ErrorMessage>
          {JSON.stringify(addAgreementFromQuoteMutation.error, null, 2)}
        </ErrorMessage>
      )}
    </form>
  )
}
