import styled from '@emotion/styled'
import { Dropdown, DropdownOption } from '@hedvig-ui'
import { DropdownProps } from '@hedvig-ui/Dropdown/dropdown'
import React from 'react'
import {
  useMemberContractsQuery,
  useSetContractForClaimMutation,
  useSetTrialForClaimMutation,
} from 'types/generated/graphql'
import gql from 'graphql-tag'
import { TypeOfContractType } from 'portals/hope/features/config/constants'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import { toast } from 'react-hot-toast'

const ContractItemTypeName = styled.div`
  font-size: 1.2em;
  padding-bottom: 0.4em;
`

const ContractItemAddress = styled.div`
  font-size: 0.8em;
  padding-bottom: 0.15em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const Tag = styled.span<{ alert?: boolean }>`
  display: inline-block;
  background-color: ${({ theme, alert }) =>
    alert ? theme.danger : theme.backgroundTransparent};
  color: ${({ theme, alert }) => alert && theme.background};

  font-size: 0.9rem;
  padding: 0.2rem 0.4rem;
  margin: 0.25rem 0.25rem 0.25rem 0;
  border-radius: 0.25rem;
`

const ContractItemDateRange = styled.div`
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const ContractItemTopTitle = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 0.2em;
  padding-bottom: 0.2em;
  margin-bottom: 0.3em;
  border-bottom: 1px solid ${({ theme }) => theme.backgroundTransparent};
`

const ContractItemStyled = styled.div`
  width: 100%;
`

const ContractItem: React.FC<{
  title: string
  address?: string
  activeFrom: string
  activeTo?: string
  tags: React.ReactNode
}> = ({ title, address, activeFrom, activeTo, tags }) => {
  return (
    <ContractItemStyled>
      {tags && <ContractItemTopTitle>{tags}</ContractItemTopTitle>}
      <ContractItemTypeName>{title}</ContractItemTypeName>
      {address && <ContractItemAddress>{address}</ContractItemAddress>}

      <ContractItemDateRange>
        {activeFrom}
        {' - '}
        {activeTo ?? 'Ongoing'}
      </ContractItemDateRange>
    </ContractItemStyled>
  )
}

gql`
  query MemberContracts($memberId: ID!) {
    member(id: $memberId) {
      memberId
      trials {
        id
        fromDate
        toDate
        displayName
        address {
          street
        }
        partner
      }
      contracts {
        id
        masterInception
        terminationDate
        currentAgreement {
          id
          address {
            street
          }
          lineOfBusinessName
          typeOfContract
          carrier
        }
      }
    }
  }

  mutation SetContractForClaim($claimId: ID!, $contractId: ID!) {
    setContractForClaim(claimId: $claimId, contractId: $contractId) {
      id
      contract {
        id
      }
    }
  }

  mutation SetTrialForClaim($claimId: ID!, $trialId: ID!) {
    setTrialForClaim(claimId: $claimId, trialId: $trialId) {
      id
      trial {
        id
      }
    }
  }
`

export const ContractDropdown: React.FC<
  {
    value?: string
    memberId: string
    claimId: string
  } & Omit<DropdownProps, 'children'>
> = ({ memberId, claimId, value, ...props }) => {
  const [setContractForClaim] = useSetContractForClaimMutation()
  const [setTrialForClaim] = useSetTrialForClaimMutation()
  const { data } = useMemberContractsQuery({ variables: { memberId } })

  const contracts = data?.member?.contracts ?? []
  const trials = data?.member?.trials ?? []

  return (
    <Dropdown placeholder="None selected" {...props}>
      {contracts.map((contract) => {
        return (
          <DropdownOption
            key={contract.id}
            selected={contract.id === value}
            onClick={() => {
              toast.promise(
                setContractForClaim({
                  variables: {
                    claimId,
                    contractId: contract.id,
                  },
                  optimisticResponse: {
                    setContractForClaim: {
                      __typename: 'Claim',
                      id: claimId,
                      contract: {
                        __typename: 'Contract',
                        ...contract,
                        id: contract.id,
                      },
                    },
                  },
                }),
                {
                  loading: 'Assigning contract',
                  success: 'Contract assigned',
                  error: 'Could not assign contract',
                },
              )
            }}
          >
            <ContractItem
              title={convertEnumToTitle(
                TypeOfContractType[contract.currentAgreement.typeOfContract],
              )}
              address={contract?.currentAgreement?.address?.street}
              activeFrom={contract.masterInception}
              activeTo={contract.terminationDate}
              tags={
                <>
                  <Tag>
                    {convertEnumToTitle(contract.currentAgreement.carrier)}
                  </Tag>
                  <Tag>
                    {convertEnumToTitle(
                      contract.currentAgreement.lineOfBusinessName,
                    )}
                  </Tag>
                </>
              }
            />
          </DropdownOption>
        )
      })}

      {trials.map((trial) => {
        return (
          <DropdownOption
            key={trial.id}
            selected={trial.id === value}
            onClick={() => {
              toast.promise(
                setTrialForClaim({
                  variables: {
                    claimId,
                    trialId: trial.id,
                  },
                  optimisticResponse: {
                    setTrialForClaim: {
                      __typename: 'Claim',
                      id: claimId,
                      trial: {
                        __typename: 'Trial',
                        ...trial,
                        id: trial.id,
                      },
                    },
                  },
                }),
                {
                  loading: 'Assigning trial',
                  success: 'Trial assigned',
                  error: (e) => {
                    console.error(e)
                    return 'Could not assign trial'
                  },
                },
              )
            }}
          >
            <ContractItem
              title={trial.displayName}
              address={trial.address.street}
              activeFrom={trial.fromDate}
              activeTo={trial.toDate}
              tags={
                <>
                  <Tag>Hedvig</Tag>
                  <Tag>{convertEnumToTitle(trial.partner)}</Tag>
                  <Tag alert={true}>Trial</Tag>
                </>
              }
            />
          </DropdownOption>
        )
      })}
    </Dropdown>
  )
}
