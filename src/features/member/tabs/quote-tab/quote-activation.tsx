import { Button, DateTimePicker } from '@hedvig-ui'
import {
  addAgreementFromQuoteOptions,
  useAddAgreementFromQuote,
} from 'graphql/use-add-agreement-from-quote'
import { useContracts } from 'graphql/use-contracts'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Contract, Quote } from 'types/generated/graphql'
import { noopFunction } from 'utils'
import { getContractByAgreementId } from 'utils/contract'
import { BottomSpacerWrapper, ErrorMessage } from './common'

const getInitialActiveFrom = (contract: Contract): Date | null =>
  contract.hasPendingAgreement ? null : new Date()

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
  if (!quote.originatingProductId) {
    toast.error('Cannot activate quote without Originating Product ID')
    return null
  }
  const [contracts, { loading }] = useContracts(memberId)
  const [activeFrom, setActiveFrom] = useState<Date | null>(null)
  const [previousAgreementActiveTo] = useState<Date | null>(null)

  useEffect(() => {
    if (!contracts) {
      return
    }
    const originatingContract = getContractByAgreementId(
      contracts,
      quote.originatingProductId!,
    )
    if (!originatingContract) {
      return
    }
    setActiveFrom(getInitialActiveFrom(originatingContract))
  }, [contracts?.length])

  const [addAgreement, addAgreementMutation] = useAddAgreementFromQuote()

  if (loading) {
    return null
  }
  const contract = getContractByAgreementId(
    contracts,
    quote.originatingProductId,
  )
  if (!contract) {
    return <>Cannot find the contract for the quote, please contact Tech</>
  }
  if (contract.hasPendingAgreement && contract.terminationDate) {
    return <>Cannot active quote for a pending contract that is terminated</>
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        if (
          addAgreementMutation.loading ||
          (contract.hasPendingAgreement && activeFrom) ||
          (!contract.hasPendingAgreement && !activeFrom) ||
          !confirm('Are you sure you want to activate?')
        ) {
          return
        }
        await toast.promise(
          addAgreement(
            addAgreementFromQuoteOptions(
              contract,
              activeFrom,
              null,
              previousAgreementActiveTo,
              quote,
            ),
          ),
          {
            loading: 'Activating quote',
            success: 'Quote activated',
            error: 'Could not activate quote',
          },
        )

        if (onSubmitted) {
          onSubmitted()
        }
      }}
    >
      {!contract.hasPendingAgreement && (
        <>
          <BottomSpacerWrapper>
            <div>
              <strong>Activation date</strong>
            </div>

            {contract.terminationDate && (
              <div>
                <div>{contract.terminationDate}</div>
              </div>
            )}
            {!contract.terminationDate && (
              <div>
                <DateTimePicker
                  date={activeFrom || new Date()}
                  setDate={(value) => {
                    if (onWipChange) {
                      onWipChange(true)
                    }
                    setActiveFrom(value)
                  }}
                />
              </div>
            )}
          </BottomSpacerWrapper>
        </>
      )}
      {contract.hasPendingAgreement && (
        <div>
          With a <strong>Pending</strong> contract the <strong>Pending</strong>{' '}
          agreement will be replaced upon activation.
        </div>
      )}

      {!addAgreementMutation.data?.addAgreementFromQuote ? (
        <Button
          status="success"
          type="submit"
          disabled={addAgreementMutation.loading}
        >
          {contract.hasPendingAgreement ? 'Replace' : 'Activate'}
        </Button>
      ) : (
        <Button
          onClick={(e) => {
            e.preventDefault()
            window.location.reload()
          }}
        >
          Reload
        </Button>
      )}

      {addAgreementMutation.error && (
        <ErrorMessage>
          {JSON.stringify(addAgreementMutation.error, null, 2)}
        </ErrorMessage>
      )}
    </form>
  )
}
