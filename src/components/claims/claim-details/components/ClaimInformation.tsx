import styled from '@emotion/styled'
import { MenuItem as MuiMenuItem, Select as MuiSelect } from '@material-ui/core'
import { ClaimState, useClaimInformationQuery } from 'api/generated/graphql'

import { PaperTitle } from 'components/claims/claim-details/components/claim-items/PaperTitle'
import { format, parseISO } from 'date-fns'
import {
  setContractForClaimOptions,
  useSetContractForClaim,
} from 'graphql/use-add-contract-id-to-claim'
import {
  setCoveringEmployeeOptions,
  useSetCoveringEmployee,
} from 'graphql/use-set-covering-employee'
import {
  updateClaimStateOptions,
  useUpdateClaimState,
} from 'graphql/use-update-claim-state'
import { CardContent, CardsWrapper, DangerCard } from 'hedvig-ui/card'
import { InfoRow, InfoText } from 'hedvig-ui/info-row'
import { Loadable } from 'hedvig-ui/loadable'
import { Label, Paragraph } from 'hedvig-ui/typography'
import React, { useState } from 'react'
import { BugFill, CloudArrowDownFill } from 'react-bootstrap-icons'
import { currentAgreementForContract } from 'utils/contract'
import { sleep } from 'utils/sleep'
import { convertEnumToTitle, getCarrierText } from 'utils/text'

interface Props {
  claimId: string
  memberId: string
}

const validateSelectOption = (
  event: React.ChangeEvent<HTMLSelectElement>,
): ClaimState => {
  const { value } = event.target
  if (!Object.values(ClaimState).includes(value as any)) {
    throw new Error(`invalid ClaimState: ${value}`)
  }
  return value as ClaimState
}

const validateSelectEmployeeClaimOption = (
  event: React.ChangeEvent<HTMLSelectElement>,
): boolean => {
  const { value } = event.target
  return value === 'True'
}

const SelectWrapper = styled('div')({
  marginTop: '1.0rem',
})

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
  margin: 0.5em 0em;
  margin-left: 0.5em;
  padding-top: 0.4em;
`

const DownloadButton = styled(CloudArrowDownFill)`
  color: ${({ theme }) => theme.foreground};
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

export const ClaimInformation: React.FC<Props> = ({ claimId, memberId }) => {
  const {
    data,
    refetch: refetchClaimInformation,
    error: queryError,
    loading: claimInformationLoading,
  } = useClaimInformationQuery({
    variables: { claimId, memberId },
  })

  const {
    registrationDate,
    recordingUrl,
    coveringEmployee,
    state,
    contract: selectedContract,
    agreement: selectedAgreement,
  } = data?.claim ?? {}
  const contracts = data?.member?.contracts ?? []
  const trials = data?.member?.trials ?? []

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
          <MuiSelect
            value={state || ''}
            onChange={async (event) => {
              await updateClaimState(
                updateClaimStateOptions(claimId, validateSelectOption(event)),
              )
            }}
          >
            {Object.values(ClaimState).map((s) => (
              <MuiMenuItem key={s} value={s}>
                {s}
              </MuiMenuItem>
            ))}
          </MuiSelect>
        </SelectWrapper>
        <SelectWrapper>
          <Label>Employee Claim</Label>
          <MuiSelect
            value={coveringEmployee ? 'True' : 'False'}
            onChange={async (event) => {
              await setCoveringEmployee(
                setCoveringEmployeeOptions(
                  claimId,
                  validateSelectEmployeeClaimOption(event),
                ),
              )
            }}
          >
            <MuiMenuItem key={'True'} value={'True'}>
              True
            </MuiMenuItem>
            <MuiMenuItem key={'False'} value={'False'}>
              False
            </MuiMenuItem>
          </MuiSelect>
        </SelectWrapper>
        {contracts && (
          <SelectWrapper>
            <Label>Contract for Claim</Label>
            <MuiSelect
              value={selectedContract?.id ? selectedContract.id : 'none'}
              onChange={async (event) => {
                if (event.target.value === 'none') {
                  return
                }
                await setContractForClaim(
                  setContractForClaimOptions({
                    claimId,
                    memberId,
                    contractId: event.target.value,
                  }),
                )
                await sleep(250)
                await refetchClaimInformation()
              }}
            >
              <MuiMenuItem disabled value={'none'} divider>
                None selected
              </MuiMenuItem>
              {contracts.map((contract) => {
                const address = currentAgreementForContract(contract)?.address
                return (
                  <MuiMenuItem key={contract.id} value={contract.id}>
                    {contract.contractTypeName}
                    {address && `, ${address.street}`}
                    <br />
                    {contract.masterInception}
                    {' - '}
                    {contract.terminationDate
                      ? contract.terminationDate
                      : 'Ongoing'}
                  </MuiMenuItem>
                )
              })}
            </MuiSelect>
          </SelectWrapper>
        )}
        {selectedAgreement && (
          <>
            <InfoRow>
              Carrier
              <InfoText>{getCarrierText(selectedAgreement.carrier)}</InfoText>
            </InfoRow>
            <InfoRow>
              Line of business
              <InfoText>
                {convertEnumToTitle(selectedAgreement.lineOfBusinessName)}
              </InfoText>
            </InfoRow>
          </>
        )}
        {!selectedAgreement && (
          <Paragraph>
            ⚠️ No agreement covers the claim on the date of loss
          </Paragraph>
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
