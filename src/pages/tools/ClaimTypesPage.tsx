import styled from '@emotion/styled'
import {
  Flex,
  MainHeadline,
  SecondLevelHeadline,
  Spacing,
  Table,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import { CreateRelationForm } from 'features/tools/claim-types/CreateRelationForm'
import React, { useState } from 'react'

const Container = styled(Flex)`
  padding: 1em;
`

const TitleOption = styled.button<{ selected?: boolean }>`
  font-size: 1.5rem;
  outline: none;
  border: none;
  background-color: transparent;
  cursor: pointer;
  transition: all 200ms;

  color: ${({ theme, selected }) =>
    selected ? theme.foreground : theme.placeholderColor};

  :hover {
    color: ${({ theme }) => theme.foreground};
  }
`

export const ClaimTypesPage: React.FC = () => {
  const [tab, setTab] = useState<
    'types' | 'properties' | 'options' | 'relations'
  >('types')
  return (
    <>
      <Flex direction="row" justify={'space-between'}>
        <MainHeadline>Claim Types</MainHeadline>
      </Flex>
      <Spacing top={'medium'} />
      <Flex direction="row">
        <Container direction="column" flex="2">
          <Flex>
            <TitleOption
              selected={tab === 'types'}
              onClick={() => setTab('types')}
            >
              Types
            </TitleOption>
            <TitleOption
              selected={tab === 'properties'}
              onClick={() => setTab('properties')}
            >
              Properties
            </TitleOption>
            <TitleOption
              selected={tab === 'options'}
              onClick={() => setTab('options')}
            >
              Options
            </TitleOption>
            <TitleOption
              selected={tab === 'relations'}
              onClick={() => setTab('relations')}
            >
              Relations
            </TitleOption>
          </Flex>
          <Spacing top />
          <Table>
            <TableHeader>
              <TableHeaderColumn>Lol</TableHeaderColumn>
            </TableHeader>
            <TableRow>
              <TableColumn>Aa tjo</TableColumn>
            </TableRow>
          </Table>
        </Container>
        <Container
          flex="1"
          direction="column"
          style={{
            marginLeft: '1em',
          }}
        >
          <SecondLevelHeadline>Create relation</SecondLevelHeadline>
          <CreateRelationForm />
        </Container>
      </Flex>
    </>
  )
}
