import styled from '@emotion/styled'
import { Button, Flex, Spacing } from '@hedvig-ui'
import { useClickOutside } from '@hedvig-ui/hooks/use-click-outside'
import chroma from 'chroma-js'
import { EditableField } from 'features/claims/claim-details/CoInsured/EditableField'
import { PlaceholderCard } from 'features/claims/claim-details/CoInsured/PlaceholderCard'
import React, { useRef, useState } from 'react'
import {
  EnvelopeFill,
  PersonFill,
  PersonPlusFill,
  PhoneFill,
} from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import {
  ClaimPageDocument,
  ClaimPageQuery,
  CoInsured,
  useDeleteCoInsuredMutation,
  useUpsertCoInsuredMutation,
} from 'types/generated/graphql'

const CoInsuredCard = styled.div`
  background-color: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.accentContrast};
  padding: 0.8em;
  border-radius: 8px;
  transition: all 200ms;
  cursor: pointer;

  :hover {
    background-color: ${({ theme }) =>
      chroma(theme.accent)
        .brighten(0.4)
        .hex()};
  }
`

const ExplanatoryText = styled.span`
  color: ${({ theme }) => theme.accent};
  font-size: 0.8em;
`

interface UseDeleteCoInsuredVariables {
  claimId: string
}
export const useDeleteCoInsured = ({
  claimId,
}: UseDeleteCoInsuredVariables) => {
  const [deleteCoInsured] = useDeleteCoInsuredMutation()

  const updateCache = (cache) => {
    const cachedData = cache.readQuery({
      query: ClaimPageDocument,
      variables: { claimId },
    })

    const cachedClaimPage = (cachedData as ClaimPageQuery)?.claim

    cache.writeQuery({
      query: ClaimPageDocument,
      data: {
        claim: {
          ...cachedClaimPage,
          coInsured: null,
        },
      },
    })
  }

  return (onSuccess?: () => void) =>
    toast.promise(
      deleteCoInsured({
        variables: {
          claimId,
        },
        optimisticResponse: {
          deleteCoInsured: true,
        },
        update: (cache, { data: response }) => {
          if (!response) {
            return
          }
          updateCache(cache)
        },
      }),
      {
        loading: 'Deleting co-insured',
        success: () => {
          onSuccess?.()
          return 'Co-insured deleted'
        },
        error: 'Could not delete co-insured',
      },
    )
}

export const CoInsuredForm: React.FC<{
  coInsured: CoInsured | null
  claimId: string
}> = ({ coInsured, claimId }) => {
  const deleteCoInsured = useDeleteCoInsured({ claimId })
  const cardRef = useRef<HTMLDivElement>(null)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(coInsured?.fullName ?? '')
  const [personalNumber, setPersonalNumber] = useState(
    coInsured?.personalNumber ?? '',
  )
  const [email, setEmail] = useState(coInsured?.email ?? '')
  const [phoneNumber, setPhoneNumber] = useState(coInsured?.phoneNumber ?? '')

  const [upsertCoInsured] = useUpsertCoInsuredMutation()

  useClickOutside(cardRef, () => {
    setCreating(false)
    setEditing(false)
  })

  const submit = () => {
    if (!name) {
      toast.error("Name can't be empty")
      reset()
      return
    }

    if (!personalNumber) {
      toast.error("Personal number can't be empty")
      reset()
      return
    }

    toast.promise(
      upsertCoInsured({
        variables: {
          claimId,
          request: {
            fullName: name,
            personalNumber,
            email,
            phoneNumber,
          },
        },
        optimisticResponse: {
          upsertCoInsured: {
            __typename: 'Claim',
            id: claimId,
            coInsured: {
              id: 'temp-id',
              fullName: name,
              personalNumber,
              email,
              phoneNumber,
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

    setEditing(false)
    setCreating(false)
  }

  const reset = () => {
    setName(coInsured?.fullName ?? '')
    setPersonalNumber(coInsured?.personalNumber ?? '')
    setEmail(coInsured?.email ?? '')
    setPhoneNumber(coInsured?.phoneNumber ?? '')
    setEditing(false)
    setCreating(false)
  }

  if (!creating && !coInsured) {
    return (
      <PlaceholderCard direction="column">
        <ExplanatoryText>Does the claim cover a co-insured?</ExplanatoryText>
        <Spacing top="small" />
        <Button
          variant="primary"
          onClick={() => {
            setEditing(true)
            setCreating(true)
          }}
          icon={
            <div style={{ marginTop: '0.05em', marginRight: '0.5em' }}>
              <PersonPlusFill />
            </div>
          }
        >
          Add information
        </Button>
      </PlaceholderCard>
    )
  }

  return (
    <CoInsuredCard ref={cardRef} onClick={() => setEditing(true)}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <EditableField
          primary={true}
          editing={editing}
          placeholder="Full name of co-insured"
          value={name}
          onChange={(newValue) => {
            setName(newValue)
          }}
        />
        <div style={{ marginTop: '0.5em' }} />
        <EditableField
          icon={
            <div style={{ marginTop: '0.15em', marginRight: '0.3em' }}>
              <PersonFill />
            </div>
          }
          editing={editing}
          placeholder="Personal number"
          value={personalNumber}
          onChange={(newValue) => {
            setPersonalNumber(newValue)
          }}
        />
        {(email || editing) && <div style={{ marginTop: '0.3em' }} />}
        <EditableField
          icon={
            <div style={{ marginTop: '0.15em', marginRight: '0.3em' }}>
              <EnvelopeFill />
            </div>
          }
          editing={editing}
          placeholder="E-mail (optional)"
          value={email}
          onChange={(newValue) => {
            setEmail(newValue)
          }}
        />
        {(phoneNumber || editing) && <div style={{ marginTop: '0.3em' }} />}
        <EditableField
          icon={
            <div style={{ marginTop: '0.15em', marginRight: '0.3em' }}>
              <PhoneFill />
            </div>
          }
          editing={editing}
          placeholder="Phone number (optional)"
          value={phoneNumber}
          onChange={(newValue) => {
            setPhoneNumber(newValue)
          }}
        />

        {editing && (
          <>
            <Spacing top="small" />
            <Flex direction="row" justify="space-between">
              <div>
                <Button variant="secondary" type="submit">
                  Save
                </Button>
                <Button
                  variant="primary"
                  style={{ marginLeft: '1em' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    reset()
                  }}
                >
                  Cancel
                </Button>
              </div>
              <Button
                status="danger"
                style={{ marginLeft: '1em' }}
                onClick={(e) => {
                  e.stopPropagation()
                  deleteCoInsured(() => reset())
                }}
              >
                Remove
              </Button>
            </Flex>
          </>
        )}
      </form>
    </CoInsuredCard>
  )
}
