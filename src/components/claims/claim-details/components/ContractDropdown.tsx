import styled from '@emotion/styled'
import { Contract } from 'api/generated/graphql'
import { Dropdown } from 'hedvig-ui/dropdown'
import { Placeholder, Shadowed } from 'hedvig-ui/typography'
import React from 'react'
import { currentAgreementForContract } from 'utils/contract'
import { convertEnumToTitle, getCarrierText } from 'utils/text'

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

const StyledContractDropdown = styled(Dropdown)`
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

const ContractItem: React.FC<{ contract: Contract }> = ({ contract }) => {
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

export const ContractDropdown: React.FC<{
  contracts: Contract[]
  selectedContract: Contract
  onChange: (value: string) => void
}> = ({ contracts, selectedContract, onChange }) => {
  return (
    <StyledContractDropdown
      options={contracts
        .filter((contract) => contract.id !== selectedContract?.id)
        .map((contract) => ({
          key: contract.id,
          value: contract.id,
          content: <ContractItem contract={contract} />,
        }))}
      onChange={onChange}
      onRender={() => {
        if (!selectedContract) {
          return <Placeholder>None selected</Placeholder>
        }

        return <ContractItem contract={selectedContract} />
      }}
      value={selectedContract?.id ?? 'none'}
    />
  )
}
