import styled from '@emotion/styled'

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
import { CoInsuredForm } from 'portals/hope/features/claims/claim-details/CoInsured/CoInsuredForm'
import React, { useState } from 'react'
import { BugFill, CloudArrowDownFill } from 'react-bootstrap-icons'
import { ClaimDatePicker } from 'portals/hope/features/claims/claim-details/ClaimInformation/components/ClaimDatePicker'
import { ClaimEmployeeDropdown } from 'portals/hope/features/claims/claim-details/ClaimInformation/components/ClaimEmployeeDropdown'
import { TermsAndConditionsLink } from 'portals/hope/features/claims/claim-details/ClaimInformation/components/TermsAndConditionsLink'
import { ClaimStatusDropdown } from 'portals/hope/features/claims/claim-details/ClaimInformation/components/ClaimStatusDropdown'
import { useRestrictClaim } from 'portals/hope/common/hooks/use-restrict-claim'
import gql from 'graphql-tag'
import {
  ClaimCoInsuredFragment,
  ClaimCoInsuredInformationDocument,
  UpsertCoInsuredMutationVariables,
  useClaimCoInsuredInformationQuery,
  useClaimInformationQuery,
  useDeleteCoInsuredMutation,
  useUpsertCoInsuredMutation,
} from 'types/generated/graphql'
import { ApolloCache, NormalizedCacheObject } from '@apollo/client'
import { toast } from 'react-hot-toast'

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

gql`
  query ClaimInformation($claimId: ID!) {
    claim(id: $claimId) {
      id
      recordingUrl
      registrationDate

      trial {
        id
      }

      contract {
        id
        typeOfContract
      }

      agreement {
        id
        typeOfContract
        lineOfBusinessName
        carrier
        partner
        createdAt
      }
    }
  }
`

gql`
  query ClaimCoInsuredInformation($claimId: ID!) {
    claim(id: $claimId) {
      id
      ...ClaimCoInsured
    }
  }

  fragment ClaimCoInsured on Claim {
    coInsured {
      id
      fullName
      personalNumber
      email
      phoneNumber
    }
  }

  mutation DeleteCoInsured($claimId: ID!) {
    deleteCoInsured(claimId: $claimId)
  }

  mutation UpsertCoInsured($claimId: ID!, $request: UpsertCoInsuredInput!) {
    upsertCoInsured(claimId: $claimId, request: $request) {
      id
      ...ClaimCoInsured
    }
  }
`

interface UseClaimCoInsuredResult {
  coInsured?: ClaimCoInsuredFragment['coInsured']
  upsertCoInsured: (
    request: UpsertCoInsuredMutationVariables['request'],
  ) => void
  removeCoInsured: () => void
}

// FIXME: Extract this logic to separate file
export const useClaimCoInsured = (claimId: string): UseClaimCoInsuredResult => {
  const [upsert] = useUpsertCoInsuredMutation()
  const [remove] = useDeleteCoInsuredMutation()

  const { data } = useClaimCoInsuredInformationQuery({ variables: { claimId } })

  const coInsured = data?.claim?.coInsured

  const removeCoInsured = () => {
    toast.promise(
      remove({
        variables: { claimId },
        optimisticResponse: {
          deleteCoInsured: true,
        },
        update: (cache: ApolloCache<NormalizedCacheObject>) => {
          cache.writeQuery({
            query: ClaimCoInsuredInformationDocument,
            data: {
              claim: {
                __typename: 'Claim',
                id: claimId,
                coInsured: null,
              },
            },
          })
        },
      }),
      {
        loading: 'Deleting co-insured',
        success: 'Co-insured deleted',
        error: 'Could not delete co-insured',
      },
    )
  }

  const upsertCoInsured = (
    request: UpsertCoInsuredMutationVariables['request'],
  ) => {
    toast.promise(
      upsert({
        variables: {
          claimId,
          request,
        },
        optimisticResponse: {
          upsertCoInsured: {
            __typename: 'Claim',
            id: claimId,
            coInsured: {
              id: 'temp-id',
              ...request,
            },
          },
        },
      }),
      {
        loading: 'Updating co-insured',
        success: 'Co-insured updated',
        error: 'Could not update co-insured',
      },
    )
  }

  return { coInsured, removeCoInsured, upsertCoInsured }
}

export const ClaimInformation: React.FC<{
  claimId: string
}> = ({ claimId }) => {
  const { confirm } = useConfirmDialog()
  const { restrict, restriction } = useRestrictClaim(claimId)

  const [creatingCoInsured, setCreatingCoInsured] = useState(false)

  const { data, error, loading } = useClaimInformationQuery({
    variables: { claimId },
  })

  const { coInsured, removeCoInsured } = useClaimCoInsured(claimId)

  const { registrationDate, recordingUrl, agreement, contract, trial } =
    data?.claim ?? {}

  const coInsureHandler = async (value: string) => {
    setCreatingCoInsured(value === 'True')
    if (coInsured && value === 'False') {
      confirm('This will delete the co-insured, are you sure?').then(() =>
        removeCoInsured(),
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
      <Loadable loading={loading}>
        <CardTitle
          title="Claim Info"
          badge={
            error
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

        {agreement ? (
          contract && (
            <TermsAndConditionsLink
              carrier={agreement.carrier}
              createdAt={agreement.createdAt}
              partner={agreement.partner ?? null}
              typeOfContract={contract.typeOfContract}
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
              <CoInsuredForm claimId={claimId} />
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
