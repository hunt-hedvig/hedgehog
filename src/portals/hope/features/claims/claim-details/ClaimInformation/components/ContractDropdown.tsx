import styled from '@emotion/styled'
import { Dropdown, DropdownOption, Shadowed } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import {
  currentAgreementForContract,
  getCarrierText,
} from 'portals/hope/features/member/tabs/contracts-tab/utils'
import React from 'react'
import { Contract, GenericAgreement } from 'types/generated/graphql'

const ContractItemTypeName = styled.div`
  font-size: 1.2em;
  padding-bottom: 0.4em;
`

const ContractItemAddress = styled.div`
  font-size: 0.8em;
  padding-bottom: 0.15em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const ContractItemCarrier = styled.div`
  padding-top: 0.15em;
  font-size: 0.9em;
  padding-bottom: 0.6em;
`

const ContractItemDateRange = styled.div`
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const ContractItemLineOfBusiness = styled.div`
  padding-top: 0.15em;
  font-size: 0.9em;
  padding-bottom: 0.6em;
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
  contract: Contract
  agreement?: GenericAgreement
}> = ({ contract, agreement }) => {
  const address = agreement?.address
  const lineOfBusiness =
    agreement && convertEnumToTitle(agreement.lineOfBusinessName)

  return (
    <ContractItemStyled>
      <ContractItemTopTitle>
        {agreement && (
          <ContractItemCarrier>
            <Shadowed>{getCarrierText(agreement?.carrier)}</Shadowed>
          </ContractItemCarrier>
        )}
        {lineOfBusiness && (
          <ContractItemLineOfBusiness
            style={{ paddingLeft: agreement && '0.5em' }}
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
        {contract.terminationDate ?? 'Ongoing'}
      </ContractItemDateRange>
    </ContractItemStyled>
  )
}

export const ContractDropdown: React.FC<{
  contracts: Contract[]
  selectedContract?: Contract
  selectedAgreement?: GenericAgreement
  onChange: (value: string) => void
}> = ({ contracts, selectedContract, selectedAgreement, onChange }) => {
  return (
    <Dropdown placeholder="None selected">
      {contracts.map((contract) => {
        return (
          <DropdownOption
            key={contract.id}
            selected={contract.id === selectedContract?.id}
            onClick={() => onChange(contract.id)}
          >
            <ContractItem
              contract={contract}
              agreement={
                contract.id === selectedContract?.id
                  ? selectedAgreement
                  : currentAgreementForContract(contract)
              }
            />
          </DropdownOption>
        )
      })}
    </Dropdown>
  )
}
