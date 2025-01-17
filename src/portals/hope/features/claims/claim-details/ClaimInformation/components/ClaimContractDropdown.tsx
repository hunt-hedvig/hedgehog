import styled from '@emotion/styled'
import { Dropdown, DropdownOption } from '@hedvig-ui'
import { DropdownProps } from '@hedvig-ui'
import React from 'react'
import {
  TypeOfContract,
  TypeOfContractType,
} from 'portals/hope/features/config/constants'
import { convertEnumToTitle } from '@hedvig-ui'
import { useClaimContracts } from 'portals/hope/common/hooks/use-claim-contracts'

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

const ContractItemCoInsured = styled.div`
  padding-top: 0.15em;
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
  numberCoInsured?: number | null
  tags: React.ReactNode
}> = ({
  title,
  address,
  activeFrom,
  activeTo,
  numberCoInsured = null,
  tags,
}) => {
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
      {numberCoInsured && (
        <ContractItemCoInsured>
          Covers holder{' '}
          {numberCoInsured > 0 ? '+ ' + numberCoInsured + ' co-insured' : ''}
        </ContractItemCoInsured>
      )}
    </ContractItemStyled>
  )
}

export const ClaimContractDropdown: React.FC<
  {
    claimId: string
  } & Omit<DropdownProps, 'children' | 'value'>
> = ({ claimId, ...props }) => {
  const { contracts, trials, selected, setSelected } =
    useClaimContracts(claimId)

  return (
    <Dropdown placeholder="None selected" {...props}>
      {contracts.map((contract) => {
        return (
          <DropdownOption
            key={contract.id}
            selected={contract.id === selected}
            onClick={() => setSelected(contract.id)}
          >
            <ContractItem
              title={convertEnumToTitle(
                TypeOfContractType[
                  contract.currentAgreement.typeOfContract as TypeOfContract
                ],
              )}
              address={contract?.currentAgreement?.address?.street}
              activeFrom={contract.masterInception}
              activeTo={contract.terminationDate}
              numberCoInsured={contract.currentAgreement.numberCoInsured}
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
            selected={trial.id === selected}
            onClick={() => setSelected(trial.id)}
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
