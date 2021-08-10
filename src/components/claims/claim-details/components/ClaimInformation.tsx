import styled from '@emotion/styled'
import {
  ClaimState,
  Contract,
  useClaimMemberContractsMasterInceptionQuery,
  useClaimPageQuery,
} from 'api/generated/graphql'

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
import { Dropdown, EnumDropdown } from 'hedvig-ui/dropdown'
import { InfoRow, InfoText } from 'hedvig-ui/info-row'
import { Loadable } from 'hedvig-ui/loadable'
import { Label, Paragraph, Placeholder, Shadowed } from 'hedvig-ui/typography'
import React, { useState } from 'react'
import { BugFill, CloudArrowDownFill } from 'react-bootstrap-icons'
import { currentAgreementForContract } from 'utils/contract'
import { convertEnumToTitle, getCarrierText } from 'utils/text'

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

const ContractItemTypeName = styled.div`
  font-size: 1.2em;
  padding-bottom: 0.6em;
`

const ContractItemAddress = styled.div`
  font-size: 0.8em;
  padding-bottom: 0.25em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const ContractItemCarrier = styled.div`
  padding-top: 0.15em;
  font-size: 0.9em;
  padding-bottom: 0.8em;
`

const ContractItemDateRange = styled.div`
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const ContractItemLineOfBusiness = styled.div`
  padding-top: 0.15em;
  font-size: 0.9em;
  padding-bottom: 0.8em;
`

const ContractItemTopTitle = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 0.2em;
  padding-bottom: 0.2em;
  margin-bottom: 0.7em;
  border-bottom: 1px solid ${({ theme }) => theme.backgroundTransparent};
`

const ContractDropdown = styled(Dropdown)`
  .visible.menu.transition {
    max-height: 500px;
  }

  &&&.selection.visible {
    background-color: ${({ theme }) => theme.accentSecondary};
  }

  && .item:hover {
    background-color: ${({ theme }) => theme.accentSecondary} !important;
  }
`

const getContractDropdownItemContent = (contract: Contract) => {
  const currentAgreement = currentAgreementForContract(contract)
  const address = currentAgreement?.address
  const lineOfBusiness =
    currentAgreement && convertEnumToTitle(currentAgreement.lineOfBusinessName)

  return (
    <>
      <ContractItemTopTitle>
        {currentAgreement && (
          <ContractItemCarrier>
            <Shadowed>{getCarrierText(currentAgreement?.carrier)}</Shadowed>
          </ContractItemCarrier>
        )}
        {lineOfBusiness && (
          <ContractItemLineOfBusiness
            style={{ paddingLeft: currentAgreement && '0.5em' }}
          >
            <Shadowed>{lineOfBusiness}</Shadowed>
          </ContractItemLineOfBusiness>
        )}
      </ContractItemTopTitle>
      <ContractItemTypeName>{contract.contractTypeName}</ContractItemTypeName>
      {address && (
        <>
          <ContractItemAddress>{address && address.street}</ContractItemAddress>
        </>
      )}

      <ContractItemDateRange>
        {contract.masterInception}
        {' - '}
        {contract.terminationDate ? contract.terminationDate : 'Ongoing'}
      </ContractItemDateRange>
    </>
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
            setValue={async (value) => {
              await updateClaimState(
                updateClaimStateOptions(claimId, validateSelectOption(value)),
              )
            }}
          />
        </SelectWrapper>
        <SelectWrapper>
          <Label>Employee Claim</Label>
          <Dropdown
            value={coveringEmployee ? 'True' : 'False'}
            onChange={async (value) => {
              await setCoveringEmployee(
                setCoveringEmployeeOptions(
                  claimId,
                  validateSelectEmployeeClaimOption(value),
                ),
              )
              await refetch()
            }}
            options={['True', 'False']}
          />
        </SelectWrapper>
        {contracts && (
          <SelectWrapper>
            <Label>Contract for Claim</Label>
            <ContractDropdown
              options={contracts
                .filter((contract) => contract.id !== selectedContract?.id)
                .map((contract) => ({
                  key: contract.id,
                  value: contract.id,
                  content: getContractDropdownItemContent(contract as Contract),
                }))}
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
              onRender={() => {
                if (!selectedContract) {
                  return <Placeholder>None selected</Placeholder>
                }

                return getContractDropdownItemContent(
                  selectedContract as Contract,
                )
              }}
              value={selectedContract?.id ?? 'none'}
            />
          </SelectWrapper>
        )}
        {!selectedAgreement && (
          <Paragraph style={{ marginTop: '1.0em' }}>
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
