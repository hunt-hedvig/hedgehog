import styled from '@emotion/styled'
import {
  ClaimState,
  Contract,
  GenericAgreement,
  useClaimMemberContractsMasterInceptionQuery,
  useClaimPageQuery,
  useSetClaimDateMutation,
} from 'types/generated/graphql'

import {
  CardContent,
  CardsWrapper,
  CardTitle,
  DangerCard,
  DateTimePicker,
  Dropdown,
  DropdownOption,
  InfoRow,
  InfoText,
  Label,
  Loadable,
  Paragraph,
} from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/utils/modal-hook'
import { format, parseISO } from 'date-fns'
import { ContractDropdown } from 'features/claims/claim-details/components/ClaimInformation/components/ContractDropdown'
import { OutcomeDropdown } from 'features/claims/claim-details/components/ClaimType/components/OutcomeDropdown'
import {
  CoInsuredForm,
  useDeleteCoInsured,
} from 'features/claims/claim-details/components/CoInsured/CoInsuredForm'
import {
  setContractForClaimOptions,
  useSetContractForClaim,
} from 'graphql/use-add-contract-id-to-claim'
import { useSetCoveringEmployee } from 'graphql/use-set-covering-employee'
import { useUpdateClaimState } from 'graphql/use-update-claim-state'
import React, { useState } from 'react'
import { BugFill, CloudArrowDownFill } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'

const validateSelectOption = (value: any): ClaimState => {
  if (!Object.values(ClaimState).includes(value as any)) {
    throw new Error(`invalid ClaimState: ${value}`)
  }
  return value as ClaimState
}

const validateSelectEmployeeClaimOption = (value: any): boolean => {
  return value === 'True'
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
  focus: boolean
}> = ({ claimId, memberId, focus }) => {
  const [creatingCoInsured, setCreatingCoInsured] = useState(false)
  const { confirm } = useConfirmDialog()
  const deleteCoInsured = useDeleteCoInsured({ claimId })
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
  } = data?.claim ?? {}

  const contracts = memberData?.member?.contracts ?? []
  const trials = memberData?.member?.trials ?? []

  const [setContractForClaim] = useSetContractForClaim()
  const [setCoveringEmployee] = useSetCoveringEmployee()
  const [updateClaimState] = useUpdateClaimState()
  const [setClaimDate] = useSetClaimDateMutation()

  const coverEmployeeHandler = async (value: string) => {
    await setCoveringEmployee({
      variables: {
        id: claimId,
        coveringEmployee: validateSelectEmployeeClaimOption(value),
      },
      optimisticResponse: {
        setCoveringEmployee: {
          id: claimId,
          __typename: 'Claim',
          coveringEmployee: validateSelectEmployeeClaimOption(value),
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
          <Dropdown focus={focus} placeholder="State">
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
          <DateTimePicker
            tabIndex={-1}
            fullWidth={true}
            date={
              (data?.claim?.dateOfOccurrence &&
                parseISO(data.claim.dateOfOccurrence)) ??
              null
            }
            setDate={(date) => {
              if (!data?.claim) {
                return
              }

              toast.promise(
                setClaimDate({
                  variables: {
                    id: claimId,
                    date: date && format(date, 'yyyy-MM-dd'),
                  },
                  optimisticResponse: {
                    setDateOfOccurrence: {
                      __typename: 'Claim',
                      id: claimId,
                      dateOfOccurrence: format(date, 'yyyy-MM-dd'),
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
                await setContractForClaim(
                  setContractForClaimOptions({
                    claimId,
                    memberId,
                    contractId: value,
                  }),
                )
                await refetch()
              }}
            />
          </SelectWrapper>
        )}
        {!selectedAgreement && (
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
      </Loadable>
    </CardContent>
  )
}