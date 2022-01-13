import styled from '@emotion/styled'
import { Dropdown, DropdownOption } from '@hedvig-ui'
import { DropdownProps } from '@hedvig-ui/Dropdown/dropdown'
import React from 'react'
import {
  useMemberContractsQuery,
  useSetClaimContractMutation,
} from 'types/generated/graphql'
import gql from 'graphql-tag'
import { TypeOfContractType } from 'portals/hope/features/config/constants'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'

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

  mutation SetClaimContract($request: SetContractForClaim!) {
    setContractForClaim(request: $request) {
      id
      contract {
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
  const [setClaimContract] = useSetClaimContractMutation()
  const { data, refetch } = useMemberContractsQuery({ variables: { memberId } })

  const contracts = data?.member?.contracts ?? []

  return (
    <Dropdown placeholder="None selected" {...props}>
      {contracts.map((contract) => {
        return (
          <DropdownOption
            key={contract.id}
            selected={contract.id === value}
            onClick={() => {
              setClaimContract({
                variables: {
                  request: { claimId, memberId, contractId: contract.id },
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
              }).then(() => refetch())
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
