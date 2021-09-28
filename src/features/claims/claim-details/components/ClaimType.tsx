import styled from '@emotion/styled'
import {
  ClaimTypes,
  useClaimPageQuery,
  useSetClaimInformationMutation,
  useSetClaimTypeMutation,
} from 'types/generated/graphql'

import {
  Button,
  CardContent,
  CardTitle,
  CardTitleBadgeProps,
  DateTimePicker,
  FadeIn,
  Input,
  Label,
  SearchableDropdownWithRef,
  Spacing,
} from '@hedvig-ui'
import { format, parseISO } from 'date-fns'
import React, { useState } from 'react'
import { BugFill, ExclamationCircleFill } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import { convertCamelcaseToTitle } from 'utils/text'

const hasLocation = (typename: ClaimTypes): boolean => {
  return [
    ClaimTypes.TheftClaim,
    ClaimTypes.AccidentalDamageClaim,
    ClaimTypes.AssaultClaim,
    ClaimTypes.TravelAccidentClaim,
    ClaimTypes.LuggageDelayClaim,
    ClaimTypes.LiabilityClaim,
    ClaimTypes.FireDamageClaim,
    ClaimTypes.ApplianceClaim,
    ClaimTypes.BurglaryClaim,
    ClaimTypes.InstallationsClaim,
    ClaimTypes.OtherClaim,
  ].includes(typename)
}

const hasItem = (typename: ClaimTypes): boolean => {
  return [
    ClaimTypes.TheftClaim,
    ClaimTypes.AccidentalDamageClaim,
    ClaimTypes.ApplianceClaim,
    ClaimTypes.BurglaryClaim,
    ClaimTypes.InstallationsClaim,
    ClaimTypes.OtherClaim,
  ].includes(typename)
}

const hasPoliceReport = (typename: ClaimTypes): boolean => {
  return [
    ClaimTypes.TheftClaim,
    ClaimTypes.AccidentalDamageClaim,
    ClaimTypes.AssaultClaim,
    ClaimTypes.TravelAccidentClaim,
    ClaimTypes.BurglaryClaim,
    ClaimTypes.OtherClaim,
  ].includes(typename)
}

const hasReceipt = (typename: ClaimTypes): boolean => {
  return [
    ClaimTypes.AccidentalDamageClaim,
    ClaimTypes.TravelAccidentClaim,
    ClaimTypes.BurglaryClaim,
    ClaimTypes.OtherClaim,
  ].includes(typename)
}

const hasTicket = (typename: ClaimTypes): boolean => {
  return typename === ClaimTypes.LuggageDelayClaim
}

const createClaimTypeOption = (claimType: string) => ({
  value: claimType,
  label: convertCamelcaseToTitle(claimType),
  searchTerms: claimType,
})

const DataField = styled.div`
  margin-top: 1em;
`

const ClaimTypeDataForm: React.FC<{ type: any; claimId: string }> = ({
  type,
  claimId,
}) => {
  const [setClaimInformation, { loading }] = useSetClaimInformationMutation()

  const [formData, setFormData] = useState({
    location: type?.location || '',
    date: type?.date ? parseISO(type.date) : null,
    item: type?.item || '',
    policeReport: type?.policeReport || '',
    receipt: type?.receipt || '',
    ticket: type?.ticket || '',
  })

  const [savedFormData, setSavedFormData] = useState(formData)

  return (
    <>
      <DataField style={{ marginTop: '1.0em' }} tabIndex={-1}>
        <Label>Date of Occurrence</Label>
        <DateTimePicker
          tabIndex={-1}
          fullWidth={true}
          date={formData.date}
          setDate={(newDate) => setFormData({ ...formData, date: newDate })}
          placeholder="When did it happen?"
        />
      </DataField>
      {hasLocation(type.__typename as ClaimTypes) && (
        <DataField>
          <Label>Location</Label>
          <Input
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="Any specific location?"
          />
        </DataField>
      )}
      {hasItem(type.__typename as ClaimTypes) && (
        <DataField style={{ marginTop: '1.0em' }}>
          <Label>Item</Label>
          <Input
            value={formData.item}
            onChange={(e) => setFormData({ ...formData, item: e.target.value })}
            placeholder="Any specific item(s)?"
          />
        </DataField>
      )}
      {hasPoliceReport(type.__typename as ClaimTypes) && (
        <DataField style={{ marginTop: '1.0em' }}>
          <Label>Police report</Label>
          <Input
            value={formData.policeReport}
            onChange={(e) =>
              setFormData({ ...formData, policeReport: e.target.value })
            }
            placeholder="Any info on a police report?"
          />
        </DataField>
      )}
      {hasReceipt(type.__typename as ClaimTypes) && (
        <DataField style={{ marginTop: '1.0em' }}>
          <Label>Receipt</Label>
          <Input
            value={formData.receipt}
            onChange={(e) =>
              setFormData({ ...formData, receipt: e.target.value })
            }
            placeholder="Is there a receipt?"
          />
        </DataField>
      )}
      {hasTicket(type.__typename as ClaimTypes) && (
        <DataField style={{ marginTop: '1.0em' }}>
          <Label>Ticket</Label>
          <Input
            value={formData.ticket}
            onChange={(e) =>
              setFormData({ ...formData, ticket: e.target.value })
            }
            placeholder="Is there a ticket?"
          />
        </DataField>
      )}
      <Spacing top="medium" />
      <Button
        fullWidth
        disabled={formData === savedFormData || loading}
        variation="primary"
        onClick={() => {
          setClaimInformation({
            variables: {
              id: claimId,
              claimInformation: {
                ...formData,
                date: formData.date && format(formData.date, 'yyyy-MM-dd'),
              },
            },
          }).then(() => {
            setSavedFormData(formData)
          })
        }}
      >
        {loading
          ? 'Saving...'
          : formData !== savedFormData
          ? 'Save changes'
          : 'Changes saved'}
      </Button>
    </>
  )
}

export const ClaimTypeForm: React.FC<{
  claimId: string
  focus: boolean
}> = ({ claimId, focus }) => {
  const {
    data: claimInformationData,
    loading: loadingClaimInformation,
    refetch,
    error: queryError,
  } = useClaimPageQuery({
    variables: { claimId },
  })

  const [
    setClaimType,
    { loading: setClaimTypeLoading },
  ] = useSetClaimTypeMutation()

  const { contract, type } = claimInformationData?.claim ?? {}

  const titleBadge = (): CardTitleBadgeProps | null => {
    if (queryError) {
      return {
        icon: BugFill,
        status: 'danger',
        label: 'Internal Error',
      }
    }
    if (!contract && !loadingClaimInformation) {
      return {
        icon: ExclamationCircleFill,
        status: 'warning',
        label: 'No contract set',
      }
    }

    return null
  }

  return (
    <CardContent>
      <CardTitle title="Claim Type" badge={titleBadge()} />
      <SearchableDropdownWithRef
        focus={focus}
        value={
          type?.__typename &&
          createClaimTypeOption(type?.__typename?.toString())
        }
        placeholder="What type of claim is this?"
        isClearable={false}
        onChange={async (selection) => {
          setClaimType({
            variables: { id: claimId, type: selection?.value ?? null },
            optimisticResponse: {
              setClaimType: {
                ...claimInformationData,
                __typename: 'Claim',
                id: claimId,
                type: selection?.value ?? null,
                events: claimInformationData?.claim?.events ?? [],
              },
            },
          }).catch(() => toast.error('Could not set type'))

          await refetch()
        }}
        noOptionsMessage={() => 'No types found'}
        options={Object.keys(ClaimTypes).map((claimType) =>
          createClaimTypeOption(claimType),
        )}
      />

      {!(setClaimTypeLoading || loadingClaimInformation) && type && (
        <FadeIn>
          <ClaimTypeDataForm type={type} claimId={claimId} />
        </FadeIn>
      )}
    </CardContent>
  )
}