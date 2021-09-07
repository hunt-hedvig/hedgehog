import styled from '@emotion/styled'
import {
  ClaimState,
  Contract,
  GenericAgreement,
  useClaimMemberContractsMasterInceptionQuery,
  useClaimPageQuery,
} from 'api/generated/graphql'

import { PaperTitle } from 'components/claims/claim-details/components/claim-items/PaperTitle'
import { ContractDropdown } from 'components/claims/claim-details/components/ContractDropdown'
import { format, parseISO } from 'date-fns'
import {
  setContractForClaimOptions,
  useSetContractForClaim,
} from 'graphql/use-add-contract-id-to-claim'
import { useSetCoveringEmployee } from 'graphql/use-set-covering-employee'
import { useUpdateClaimState } from 'graphql/use-update-claim-state'
import { CardContent, CardsWrapper, DangerCard } from 'hedvig-ui/card'
import { Dropdown, EnumDropdown } from 'hedvig-ui/dropdown'
import { InfoRow, InfoText } from 'hedvig-ui/info-row'
import { Loadable } from 'hedvig-ui/loadable'
import { Label, Paragraph } from 'hedvig-ui/typography'
import React, { useState } from 'react'
import { BugFill, CloudArrowDownFill } from 'react-bootstrap-icons'

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
}> = ({ claimId, memberId }) => {
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
  } = data?.claim ?? {}

  const contracts = memberData?.member?.contracts ?? []
  const trials = memberData?.member?.trials ?? []

  const [setContractForClaim] = useSetContractForClaim()
  const [setCoveringEmployee] = useSetCoveringEmployee()
  const [updateClaimState] = useUpdateClaimState()

  return (
    <CardContent>
      <Loadable loading={claimInformationLoading}>
        <PaperTitle
          title={'Claim Info'}
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
          <EnumDropdown
            value={state || ''}
            enumToSelectFrom={ClaimState}
            placeholder={''}
            onChange={async (value) => {
              await updateClaimState({
                variables: { id: claimId, state: validateSelectOption(value) },
                optimisticResponse: {
                  updateClaimState: {
                    id: claimId,
                    __typename: 'Claim',
                    state: validateSelectOption(value),
                    events: [],
                  },
                },
              })
            }}
          />
        </SelectWrapper>
        <SelectWrapper>
          <Label>Employee Claim</Label>
          <Dropdown
            value={coveringEmployee ? 'True' : 'False'}
            onChange={async (value) => {
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
                    events: [],
                  },
                },
              })
            }}
            options={[
              { key: 0, value: 'True', text: 'True' },
              { key: 1, value: 'False', text: 'False' },
            ]}
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
