import {
  Button,
  ButtonsGroup,
  FourthLevelHeadline,
  SearchableDropdown,
  Spacing,
  TextArea,
  TextDatePicker,
} from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  Contract,
  useChangeTerminationDateMutation,
  useRevertTerminationMutation,
  useTerminateContractMutation,
} from 'types/generated/graphql'
import { getTodayFormatDate } from 'portals/hope/features/member/tabs/contracts-tab/agreement/helpers'

export enum TerminationReason {
  DissatisfiedWithService = 'DISSATISFIED_WITH_SERVICE',
  DissatisfiedWithApp = 'DISSATISFIED_WITH_APP',
  DissatisfiedWithHedvig = 'DISSATISFIED_WITH_HEDVIG',
  DissatisfiedWithOther = 'DISSATISFIED_WITH_OTHER',
  AlreadyHaveInsurance = 'ALREADY_HAVE_INSURANCE',
  CoveredByPartnersInsurance = 'COVERED_BY_PARTNERS_INSURANCE',
  PartnerAlreadyHasHedvigInsurance = 'PARTNER_ALREADY_HAS_HEDVIG_INSURANCE',
  GotOfferFromJobOrUnionOrSimilar = 'GOT_OFFER_FROM_JOB_OR_UNION_OR_SIMILAR',
  WantToKeepOldInsurance = 'WANT_TO_KEEP_OLD_INSURANCE',
  StuckWithOldInsurance = 'STUCK_WITH_OLD_INSURANCE',
  DontNeedInsurance = 'DONT_NEED_INSURANCE',
  WantedOtherTypeOfInsurance = 'WANTED_OTHER_TYPE_OF_INSURANCE',
  RegretByRightToWithraw = 'REGRET_BY_RIGHT_TO_WITHRAW',
  Moved = 'MOVED',
  MovedAbroad = 'MOVED_ABROAD',
  MovedInWithParents = 'MOVED_IN_WITH_PARENTS',
  Price = 'PRICE',
  MissedPayments = 'MISSED_PAYMENTS',
  MissedPaymentsBadRisk = 'MISSED_PAYMENTS_BAD_RISK',
  PaymentIssues = 'PAYMENT_ISSUES',
  DiscountPeriodOver = 'DISCOUNT_PERIOD_OVER',
  ConfirmedFraud = 'CONFIRMED_FRAUD',
  SuspectedFraud = 'SUSPECTED_FRAUD',
  SignedByMistake = 'SIGNED_BY_MISTAKE',
  Other = 'OTHER',
  Unknown = 'UNKNOWN',
  RenewalPrice = 'RENEWAL_PRICE',
  NoFeedback = 'NO_FEEDBACK',
  Switcher = 'SWITCHER',
}

const initialTerminationDate = (contract: Contract): string =>
  contract.terminationDate || getTodayFormatDate()

export const TerminationDate: React.FC<{
  contract: Contract
}> = ({ contract }) => {
  const [datePickerEnabled, setDatePickerEnabled] = useState(false)
  const [terminationDate, setTerminationDate] = useState<string | null>(
    initialTerminationDate(contract),
  )
  const [terminationReason, setTerminationReason] =
    useState<TerminationReason | null>(null)
  const [comment, setComment] = useState('')

  const reset = () => {
    setTerminationDate(initialTerminationDate(contract))
    setTerminationReason(null)
    setDatePickerEnabled(false)
  }
  const [terminateContract, { loading: terminateContractLoading }] =
    useTerminateContractMutation()
  const [changeTerminationDate, { loading: changeTerminationDateLoading }] =
    useChangeTerminationDateMutation()
  const [revertTermination, { loading: revertTerminationLoading }] =
    useRevertTerminationMutation()

  const { confirm } = useConfirmDialog()

  if (contract.terminationDate) {
    return (
      <>
        {!datePickerEnabled && (
          <>
            <Spacing bottom width="auto">
              <FourthLevelHeadline>
                {contract.terminationDate}
              </FourthLevelHeadline>
            </Spacing>
            <ButtonsGroup>
              <Button
                variant="secondary"
                onClick={() => setDatePickerEnabled(true)}
              >
                Change
              </Button>
              <Button
                status="success"
                disabled={revertTerminationLoading}
                onClick={() => {
                  confirm('Are you want to revert the termination?').then(
                    () => {
                      toast.promise(
                        revertTermination({
                          variables: {
                            contractId: contract.id,
                          },
                          optimisticResponse: {
                            revertTermination: {
                              __typename: 'Contract',
                              id: contract.id,
                              holderMember: contract.holderMember,
                              terminationDate: null,
                            },
                          },
                        }),
                        {
                          loading: 'Reverting termination',
                          success: () => {
                            return 'Termination reverted'
                          },
                          error: 'Could not revert termination',
                        },
                      )
                    },
                  )
                }}
              >
                Revert
              </Button>
            </ButtonsGroup>
          </>
        )}
        {datePickerEnabled && (
          <>
            <Spacing bottom width="auto">
              <TextDatePicker
                onChange={(date) => date && setTerminationDate(date)}
                value={terminationDate}
              />
            </Spacing>
            <ButtonsGroup>
              <Button
                disabled={changeTerminationDateLoading}
                onClick={() => {
                  const confirmMessage = `Are you sure you want to change the termination date from ${contract.terminationDate} to ${terminationDate}?`

                  confirm(confirmMessage).then(() => {
                    toast.promise(
                      changeTerminationDate({
                        variables: {
                          contractId: contract.id,
                          request: {
                            newTerminationDate: terminationDate,
                          },
                        },
                        optimisticResponse: {
                          changeTerminationDate: {
                            __typename: 'Contract',
                            id: contract.id,
                            holderMember: contract.holderMember,
                            terminationDate,
                          },
                        },
                      }),
                      {
                        loading: 'Changing termination date',
                        success: () => {
                          reset()
                          return 'Termination date changed'
                        },
                        error: 'Could not change termination date',
                      },
                    )
                  })
                }}
              >
                Confirm
              </Button>
              <Button variant="tertiary" onClick={() => reset()}>
                Cancel
              </Button>
            </ButtonsGroup>
          </>
        )}
      </>
    )
  }
  return (
    <>
      {!datePickerEnabled && (
        <Button status="danger" onClick={() => setDatePickerEnabled(true)}>
          Terminate contract
        </Button>
      )}
      {datePickerEnabled && (
        <>
          <TextDatePicker
            onChange={(date) => date && setTerminationDate(date)}
            value={terminationDate}
          />
          <Spacing top="small" />
          <div style={{ width: '100%' }}>
            <SearchableDropdown
              placeholder="Reason"
              onChange={(data) =>
                data && setTerminationReason(data.value as TerminationReason)
              }
              noOptionsMessage={() => 'Reason not found'}
              options={Object.values(TerminationReason).map((reason) => ({
                label: convertEnumToTitle(reason),
                value: reason,
                text: convertEnumToTitle(reason),
              }))}
            />
          </div>
          <Spacing top="small" />
          <TextArea
            placeholder="Comment on the reason of termination..."
            value={comment}
            onChange={(e) => setComment(e.currentTarget.value)}
          />
          <Spacing top="small" />
          <ButtonsGroup>
            <Button
              status="danger"
              disabled={terminationReason === null || terminateContractLoading}
              onClick={() => {
                const confirmedMsg = `Are you sure you want to terminate this contract with the termination date ${terminationDate}?`

                confirm(confirmedMsg).then(() => {
                  toast.promise(
                    terminateContract({
                      variables: {
                        contractId: contract.id,
                        request: {
                          terminationDate,
                          terminationReason: terminationReason || '',
                          comment,
                        },
                      },
                      optimisticResponse: {
                        terminateContract: {
                          __typename: 'Contract',
                          id: contract.id,
                          holderMember: contract.holderMember,
                          terminationDate,
                        },
                      },
                    }),
                    {
                      loading: 'Terminating contract',
                      success: () => {
                        reset()
                        return 'Contract terminated'
                      },
                      error: 'Could not terminate contract',
                    },
                  )
                })
              }}
            >
              Terminate
            </Button>
            <Button variant="tertiary" onClick={() => reset()}>
              Cancel
            </Button>
          </ButtonsGroup>
        </>
      )}
    </>
  )
}
