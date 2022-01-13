import styled from '@emotion/styled'
import {
  ClaimPageDocument,
  ClaimState,
  Contract,
  GenericAgreement,
  useClaimMemberContractsMasterInceptionQuery,
  useClaimPageQuery,
  useRestrictResourceAccessMutation,
  useSetClaimDateMutation,
  useSetContractForClaimMutation,
  useSetCoveringEmployeeMutation,
  useUpdateClaimStateMutation,
} from 'types/generated/graphql'

import {
  Button,
  CardContent,
  CardsWrapper,
  CardTitle,
  DangerCard,
  Dropdown,
  DropdownOption,
  InfoRow,
  InfoText,
  Label,
  Loadable,
  Paragraph,
  TextDatePicker,
} from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import { format, parseISO } from 'date-fns'
import { ContractDropdown } from 'portals/hope/features/claims/claim-details/ClaimInformation/components/ContractDropdown'
import {
  ClaimOutcomes,
  OutcomeDropdown,
} from 'portals/hope/features/claims/claim-details/ClaimType/components/OutcomeDropdown'
import {
  CoInsuredForm,
  useDeleteCoInsured,
} from 'portals/hope/features/claims/claim-details/CoInsured/CoInsuredForm'
import React, { useState } from 'react'
import { BugFill, CloudArrowDownFill } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'

const validateSelectOption = (value): ClaimState => {
  if (!Object.values(ClaimState).includes(value)) {
    throw new Error(`invalid ClaimState: ${value}`)
  }

  return value as ClaimState
}

const SelectWrapper = styled.div`
  margin-top: 1em;
`

const Audio = styled('audio')`
  width: 100%;
`

const ClaimAudioWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-right: 1em;
  justify-content: space-between;
  align-items: center;
`

const DownloadWrapper = styled.a`
  font-size: 1.5em;
  margin: 0.5em 0 0.5em 0.5em;
  padding-top: 0.4em;
`

const DownloadButton = styled(CloudArrowDownFill)`
  color: ${({ theme }) => theme.foreground};
`

const NoAgreementWarning = styled(Paragraph)`
  margin-top: 1em;
`

const ClaimAudio: React.FC<{ recordingUrl: string }> = ({ recordingUrl }) => {
  const [canPlay, setCanPlay] = useState<null | boolean>(null)

  if (canPlay === false) {
    return null
  }

  return (
    <ClaimAudioWrapper>
      <Audio
        controls
        controlsList="nodownload"
        onCanPlay={() => setCanPlay(true)}
        onError={() => setCanPlay(false)}
      >
        <source src={recordingUrl} type="audio/aac" />
      </Audio>
      <DownloadWrapper
        href={recordingUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
      >
        <DownloadButton />
      </DownloadWrapper>
    </ClaimAudioWrapper>
  )
}
export const ClaimInformation: React.FC<{
  claimId: string
  memberId: string
  restricted: boolean
}> = ({ claimId, memberId, restricted }) => {
  const [creatingCoInsured, setCreatingCoInsured] = useState(false)
  const { confirm } = useConfirmDialog()
  const deleteCoInsured = useDeleteCoInsured({ claimId })
  const [restrictResourceAccess] = useRestrictResourceAccessMutation()
  const {
    data,
    error: queryError,
    loading: claimInformationLoading,
    refetch,
  } = useClaimPageQuery({
    variables: { claimId },
  })

  const { data: memberData } = useClaimMemberContractsMasterInceptionQuery({
    variables: { memberId },
  })

  const {
    registrationDate,
    recordingUrl,
    coveringEmployee,
    state,
    contract: selectedContract,
    agreement: selectedAgreement,
    coInsured,
    payments = [],
    outcome,
  } = data?.claim ?? {}

  const contracts = memberData?.member?.contracts ?? []
  const trials = memberData?.member?.trials ?? []

  const [setContractForClaim] = useSetContractForClaimMutation()
  const [setCoveringEmployee] = useSetCoveringEmployeeMutation()
  const [updateClaimState] = useUpdateClaimStateMutation()
  const [setClaimDate] = useSetClaimDateMutation()

  const coverEmployeeHandler = async (value: string) => {
    await setCoveringEmployee({
      variables: {
        id: claimId,
        coveringEmployee: value === 'True',
      },
      optimisticResponse: {
        setCoveringEmployee: {
          id: claimId,
          __typename: 'Claim',
          coveringEmployee: value === 'True',
          events: data?.claim?.events ?? [],
        },
      },
    })
  }

  const coInsureHandler = async (value: string) => {
    setCreatingCoInsured(value === 'True')
    if (coInsured && value === 'False') {
      confirm('This will delete the co-insured, are you sure?').then(() =>
        deleteCoInsured(),
      )
    }
  }

  const setClaimStateHandler = async (value: string) => {
    if (
      (data?.claim?.state === ClaimState.Open ||
        data?.claim?.state === ClaimState.Reopened) &&
      (outcome === ClaimOutcomes.DUPLICATE ||
        outcome === ClaimOutcomes.NOT_COVERED_BY_TERMS ||
        outcome === ClaimOutcomes.RETRACTED_BY_MEMBER ||
        outcome === ClaimOutcomes.RETRACTED_BY_HEDVIG) &&
      payments.length !== 0
    ) {
      toast.error("This outcome can't be used to close when there are payments")
      return
    }

    await updateClaimState({
      variables: { id: claimId, state: validateSelectOption(value) },
      optimisticResponse: {
        updateClaimState: {
          id: claimId,
          __typename: 'Claim',
          state: validateSelectOption(value),
          events: data?.claim?.events ?? [],
        },
      },
    })
  }

  const handleRestrictAccess = () => {
    if (!data) {
      return
    }

    toast.promise(
      restrictResourceAccess({
        variables: { resourceId: claimId },
        update: (cache, { data: response }) => {
          cache.writeQuery({
            query: ClaimPageDocument,
            data: {
              claim: {
                __typename: 'Claim',
                ...data.claim,
                restriction: response,
              },
            },
          })
        },
      }),
      {
        loading: 'Restricting access',
        success: 'Access restricted',
        error: 'Could not restrict access',
      },
    )
  }

  const coverEmployeeOptions = [
    {
      key: 0,
      value: 'True',
      text: 'True',
      selected: coveringEmployee || false,
    },
    { key: 1, value: 'False', text: 'False', selected: !coveringEmployee },
  ]

  const coInsuredClaimOptions = [
    {
      key: 0,
      value: 'True',
      text: 'True',
      selected: Boolean(creatingCoInsured || coInsured),
    },
    {
      key: 1,
      value: 'False',
      text: 'False',
      selected: Boolean(!creatingCoInsured && !coInsured),
    },
  ]

  return (
    <CardContent>
      <Loadable loading={claimInformationLoading}>
        <CardTitle
          title="Claim Info"
          badge={
            queryError
              ? {
                  icon: BugFill,
                  status: 'danger',
                  label: 'Internal Error',
                }
              : null
          }
        />
        <InfoRow>
          Registered at
          <InfoText>
            {registrationDate &&
              format(parseISO(registrationDate), 'yyyy-MM-dd HH:mm:ss')}
          </InfoText>
        </InfoRow>
        {recordingUrl && <ClaimAudio recordingUrl={recordingUrl} />}
        <SelectWrapper>
          <Label>Status</Label>
          <Dropdown placeholder="State">
            {Object.keys(ClaimState).map((key) => (
              <DropdownOption
                key={key}
                onClick={() => setClaimStateHandler(ClaimState[key])}
                selected={state === ClaimState[key]}
              >
                {key}
              </DropdownOption>
            ))}
          </Dropdown>
        </SelectWrapper>
        <SelectWrapper>
          <Label>Claim outcome</Label>
          {!!data?.claim?.state && (
            <OutcomeDropdown
              claimState={data.claim.state}
              outcome={data?.claim?.outcome ?? null}
              claimId={claimId}
            />
          )}
        </SelectWrapper>
        <SelectWrapper>
          <Label>Date of Occurrence</Label>
          <TextDatePicker
            value={data?.claim?.dateOfOccurrence ?? null}
            onChange={(date) => {
              if (!data?.claim || !date) {
                return
              }

              toast.promise(
                setClaimDate({
                  variables: {
                    id: claimId,
                    date,
                  },
                  optimisticResponse: {
                    setDateOfOccurrence: {
                      __typename: 'Claim',
                      id: claimId,
                      dateOfOccurrence: date,
                      contract: data?.claim?.contract,
                    },
                  },
                }),
                {
                  loading: 'Setting date of occurrence',
                  success: 'Date of occurrence set',
                  error: 'Could not set date of occurrence',
                },
              )
            }}
            placeholder="When did it happen?"
          />
        </SelectWrapper>
        {contracts && (
          <SelectWrapper>
            <Label>Contract for Claim</Label>
            <ContractDropdown
              contracts={contracts as Contract[]}
              selectedContract={selectedContract as Contract | undefined}
              selectedAgreement={
                selectedAgreement as GenericAgreement | undefined
              }
              onChange={async (value) => {
                await setContractForClaim({
                  variables: {
                    request: { claimId, memberId, contractId: value },
                  },
                })
                await refetch()
              }}
            />
          </SelectWrapper>
        )}
        {selectedAgreement ? null : (
          // TODO: Show TermsAndConditions here instead of null, but it currently just yields 403
          <NoAgreementWarning>
            ⚠️ No agreement covers the claim on the date of loss
          </NoAgreementWarning>
        )}
        <SelectWrapper>
          <Label>Employee Claim</Label>
          <Dropdown>
            {coverEmployeeOptions.map((opt) => (
              <DropdownOption
                key={opt.key}
                selected={opt.selected}
                onClick={() => coverEmployeeHandler(opt.value)}
              >
                {opt.text}
              </DropdownOption>
            ))}
          </Dropdown>
        </SelectWrapper>
        <SelectWrapper>
          <Label>Co-insured Claim</Label>
          <Dropdown>
            {coInsuredClaimOptions.map((opt) => (
              <DropdownOption
                key={opt.key}
                selected={opt.selected}
                onClick={() => coInsureHandler(opt.value)}
              >
                {opt.text}
              </DropdownOption>
            ))}
          </Dropdown>
          {(creatingCoInsured || coInsured) && (
            <>
              <div style={{ marginTop: '0.5em' }} />
              <CoInsuredForm coInsured={coInsured ?? null} claimId={claimId} />
            </>
          )}
        </SelectWrapper>
        {contracts.length === 0 && trials.length > 0 && (
          <CardsWrapper>
            <DangerCard>
              This member has a trial which may cover this claim, but no
              contract. This case can not be handled in Hope yet, please contact
              the MX tech team.
            </DangerCard>
          </CardsWrapper>
        )}
        {!restricted && (
          <SelectWrapper>
            <Button
              variant="tertiary"
              style={{
                width: '100%',
              }}
              onClick={() =>
                confirm('Are you sure you want to restrict access?').then(() =>
                  handleRestrictAccess(),
                )
              }
            >
              Restrict claim access
            </Button>
          </SelectWrapper>
        )}
      </Loadable>
    </CardContent>
  )
}

{
  /*
  const TermsAndConditions: React.FC<{
    typeOfContract: string
    partner: string | null
    carrier: string
    createdAt: string
  }> = ({typeOfContract, partner, carrier, createdAt}) => {
    const {settings} = useMe()

    const {data} = useGetTermsAndConditionsQuery({
      variables: {
        contractType: typeOfContract,
        partner,
        carrier,
        date: createdAt.split('T')[0],
        locale: settings[UserSettingKey.Languages] || 'en_SE',
      },
    })

    if (!data?.termsAndConditions) {
      return null
    }

    return (
      <Spacing top="small">
        <a
          href={data.termsAndConditions.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms and Conditions
        </a>
      </Spacing>
    )
  }
   */
}
