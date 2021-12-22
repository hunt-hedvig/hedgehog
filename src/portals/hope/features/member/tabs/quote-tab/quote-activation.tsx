import { Button, TextDatePicker } from '@hedvig-ui'
import { format } from 'date-fns'
import { useContracts } from 'portals/hope/features/member/tabs/contracts-tab/hooks/use-contracts'
import { getContractByAgreementId } from 'portals/hope/features/member/tabs/contracts-tab/utils'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  Contract,
  GetQuotesDocument,
  Quote,
  useAddAgreementFromQuoteMutation,
} from 'types/generated/graphql'
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
  onSubmitted = () => void 0,
  onWipChange = () => void 0,
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

  const [addAgreement, addAgreementMutation] =
    useAddAgreementFromQuoteMutation()

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
          addAgreement({
            variables: {
              id: quote.id,
              activeFrom: activeFrom ? format(activeFrom, 'yyyy-MM-dd') : null,
              activeTo: null,
              contractId: contract.id,
              previousAgreementActiveTo: previousAgreementActiveTo
                ? format(previousAgreementActiveTo, 'yyy-MM-dd')
                : null,
            },
            refetchQueries: () => [
              {
                query: GetQuotesDocument,
                variables: { memberId: contract.holderMember.memberId },
              },
            ],
          }),
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
                <TextDatePicker
                  onChange={(date) => {
                    if (!date) {
                      return
                    }

                    if (onWipChange) {
                      onWipChange(true)
                    }
                    setActiveFrom(date)
                  }}
                  value={activeFrom || new Date()}
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
