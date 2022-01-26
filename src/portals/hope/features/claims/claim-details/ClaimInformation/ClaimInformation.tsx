import styled from '@emotion/styled'
import { useClaimPageQuery } from 'types/generated/graphql'

import {
  Button,
  CardContent,
  CardTitle,
  Dropdown,
  DropdownOption,
  InfoRow,
  InfoText,
  Label,
  Loadable,
  Paragraph,
} from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import { format, parseISO } from 'date-fns'
import { ClaimContractDropdown } from 'portals/hope/features/claims/claim-details/ClaimInformation/components/ClaimContractDropdown'
import { ClaimOutcomeDropdown } from 'portals/hope/features/claims/claim-details/ClaimInformation/components/ClaimOutcomeDropdown'
import {
  CoInsuredForm,
  useDeleteCoInsured,
} from 'portals/hope/features/claims/claim-details/CoInsured/CoInsuredForm'
import React, { useState } from 'react'
import { BugFill, CloudArrowDownFill } from 'react-bootstrap-icons'
import { ClaimDatePicker } from 'portals/hope/features/claims/claim-details/ClaimInformation/components/ClaimDatePicker'
import { ClaimEmployeeDropdown } from 'portals/hope/features/claims/claim-details/ClaimInformation/components/ClaimEmployeeDropdown'
import { TermsAndConditionsLink } from 'portals/hope/features/claims/claim-details/ClaimInformation/components/TermsAndConditionsLink'
import { ClaimStatusDropdown } from 'portals/hope/features/claims/claim-details/ClaimInformation/components/ClaimStatusDropdown'
import { useRestrictClaim } from 'portals/hope/common/hooks/use-restrict-claim'

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
}> = ({ claimId }) => {
  const { confirm } = useConfirmDialog()
  const { restrict, restriction } = useRestrictClaim(claimId)

  const [creatingCoInsured, setCreatingCoInsured] = useState(false)
  const deleteCoInsured = useDeleteCoInsured({ claimId })
  const {
    data,
    error: queryError,
    loading: claimInformationLoading,
  } = useClaimPageQuery({
    variables: { claimId },
  })

  const {
    registrationDate,
    recordingUrl,
    agreement: selectedAgreement,
    coInsured,
    contract: selectedContract,
    trial,
  } = data?.claim ?? {}

  const coInsureHandler = async (value: string) => {
    setCreatingCoInsured(value === 'True')
    if (coInsured && value === 'False') {
      confirm('This will delete the co-insured, are you sure?').then(() =>
        deleteCoInsured(),
      )
    }
  }

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
          <ClaimStatusDropdown claimId={claimId} />
        </SelectWrapper>
        <SelectWrapper>
          <Label>Claim outcome</Label>
          <ClaimOutcomeDropdown claimId={claimId} />
        </SelectWrapper>
        <SelectWrapper>
          <Label>Date of Occurrence</Label>
          <ClaimDatePicker claimId={claimId} />
        </SelectWrapper>
        <SelectWrapper>
          <Label>Contract for Claim</Label>
          <ClaimContractDropdown claimId={claimId} />
        </SelectWrapper>

        {selectedAgreement ? (
          selectedContract && (
            <TermsAndConditionsLink
              carrier={selectedAgreement.carrier}
              createdAt={selectedAgreement.createdAt}
              partner={selectedAgreement.partner ?? null}
              typeOfContract={selectedContract.typeOfContract}
            />
          )
        ) : trial ? null : (
          <NoAgreementWarning>
            ⚠️ No agreement covers the claim on the date of loss
          </NoAgreementWarning>
        )}
        <SelectWrapper>
          <Label>Employee Claim</Label>
          <ClaimEmployeeDropdown claimId={claimId} />
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
        {!restriction && (
          <SelectWrapper>
            <Button
              variant="tertiary"
              style={{
                width: '100%',
              }}
              onClick={() =>
                confirm('Are you sure you want to restrict access?').then(() =>
                  restrict(),
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
