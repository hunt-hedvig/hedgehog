import styled from '@emotion/styled'
import {
  ClaimTypes,
  useClaimInformationQuery,
  useSetClaimInformationMutation,
  useSetClaimTypeMutation,
} from 'api/generated/graphql'

import {
  PaperTitle,
  PaperTitleBadgeProps,
} from 'components/claims/claim-details/components/claim-items/PaperTitle'
import { format, parseISO } from 'date-fns'
import { Button } from 'hedvig-ui/button'
import { CardContent } from 'hedvig-ui/card'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { Input } from 'hedvig-ui/input'
import { SearchableDropdown } from 'hedvig-ui/searchable-dropdown'
import { Spacing } from 'hedvig-ui/spacing'
import { Label } from 'hedvig-ui/typography'
import React, { useState } from 'react'
import { BugFill, ExclamationCircleFill } from 'react-bootstrap-icons'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { withShowNotification } from 'utils/notifications'
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
      {hasLocation(type.__typename as ClaimTypes) && (
        <DataField>
          <Label>Location</Label>
          <Input
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder={'Any specific location?'}
          />
        </DataField>
      )}
      <DataField style={{ marginTop: '1.0em' }}>
        <Label>Date of Occurrence</Label>
        <DateTimePicker
          fullWidth={true}
          date={formData.date ?? new Date()}
          setDate={(newDate) => setFormData({ ...formData, date: newDate })}
        />
      </DataField>
      {hasItem(type.__typename as ClaimTypes) && (
        <DataField style={{ marginTop: '1.0em' }}>
          <Label>Item</Label>
          <Input
            value={formData.item}
            onChange={(e) => setFormData({ ...formData, item: e.target.value })}
            placeholder={'Any specific item(s)?'}
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
            placeholder={'Any info on a police report?'}
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
            placeholder={'Is there a receipt?'}
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
            placeholder={'Is there a ticket?'}
          />
        </DataField>
      )}
      <Spacing top={'medium'} />
      <Button
        fullWidth={true}
        disabled={formData === savedFormData || loading}
        variation={'primary'}
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

const ClaimTypeComponent: React.FC<{
  claimId: string
  memberId: string
} & WithShowNotification> = ({ claimId, memberId, showNotification }) => {
  const {
    data: claimInformationData,
    loading: loadingClaimInformation,
    refetch,
    error: queryError,
  } = useClaimInformationQuery({
    variables: { claimId, memberId },
  })

  const [
    setClaimType,
    { loading: setClaimTypeLoading },
  ] = useSetClaimTypeMutation()

  const { contract, type } = claimInformationData?.claim ?? {}

  const titleBadge = (): PaperTitleBadgeProps | null => {
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
      <PaperTitle title={'Claim Type'} badge={titleBadge()} />
      <SearchableDropdown
        value={
          type?.__typename &&
          createClaimTypeOption(type?.__typename?.toString())
        }
        placeholder={'What type of claim is this?'}
        isLoading={setClaimTypeLoading || loadingClaimInformation}
        isClearable={false}
        onChange={(selection) => {
          setClaimType({
            variables: { id: claimId, type: selection?.value ?? null },
          })
            .then(async () => {
              await refetch()
            })
            .catch((e) => {
              showNotification({
                header: 'Error',
                type: 'red',
                message: e.message,
              })
            })
        }}
        noOptionsMessage={() => 'No types found'}
        options={Object.keys(ClaimTypes).map((claimType) =>
          createClaimTypeOption(claimType),
        )}
      />
      {type && <ClaimTypeDataForm type={type} claimId={claimId} />}
    </CardContent>
  )
}

export const ClaimTypeForm = withShowNotification(ClaimTypeComponent)
