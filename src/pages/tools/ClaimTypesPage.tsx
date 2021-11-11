import styled from '@emotion/styled'
import {
  FadeIn,
  Flex,
  Input,
  MainHeadline,
  SecondLevelHeadline,
  Spacing,
} from '@hedvig-ui'
import { CreateOptionForm } from 'features/tools/claim-types/forms/CreateOptionForm'
import { CreatePropertyForm } from 'features/tools/claim-types/forms/CreatePropertyForm'
import { CreateRelationForm } from 'features/tools/claim-types/forms/CreateRelationForm'
import { OptionsTable } from 'features/tools/claim-types/tables/OptionsTable'
import { PropertiesTable } from 'features/tools/claim-types/tables/PropertiesTable'
import { RelationsTable } from 'features/tools/claim-types/tables/RelationsTable'
import { TypesTable } from 'features/tools/claim-types/tables/TypesTable'
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

const ClaimTypesPage: React.FC = () => {
  const [tab, setTab] = useState<
    'types' | 'properties' | 'options' | 'relations'
  >('types')
  const [filter, setFilter] = useState('')

  React.useEffect(() => {
    document.title = 'Claim Types'
  }, [])

  return (
    <>
      <Flex direction="row" justify={'space-between'}>
        <MainHeadline>Claim Types</MainHeadline>
      </Flex>
      <Spacing top={'medium'} />
      <Flex direction="row">
        <Container direction="column" flex="2" align="center">
          <Flex align="center" justify="space-between">
            <div>
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
            </div>
            <div>
              <Input
                size="small"
                value={filter}
                placeholder="Your filter goes here"
                onChange={(e) => setFilter(e.currentTarget.value)}
                style={{ width: '200px' }}
              />
            </div>
          </Flex>
          <Spacing top />
          {tab === 'types' && (
            <FadeIn style={{ width: '100%' }}>
              <TypesTable filter={filter} />
            </FadeIn>
          )}
          {tab === 'properties' && (
            <FadeIn style={{ width: '100%' }}>
              <PropertiesTable filter={filter} />
            </FadeIn>
          )}
          {tab === 'options' && (
            <FadeIn style={{ width: '100%' }}>
              <OptionsTable filter={filter} />
            </FadeIn>
          )}
          {tab === 'relations' && (
            <FadeIn style={{ width: '100%' }}>
              <RelationsTable filter={filter} />
            </FadeIn>
          )}
        </Container>
        <Container
          flex="1"
          direction="column"
          style={{
            marginLeft: '1em',
          }}
        >
          {tab === 'properties' && (
            <div style={{ marginTop: '5rem', width: '100%' }}>
              <SecondLevelHeadline>Create property</SecondLevelHeadline>
              <CreatePropertyForm />
            </div>
          )}
          {tab === 'options' && (
            <div style={{ marginTop: '5rem', width: '100%' }}>
              <SecondLevelHeadline>Create option</SecondLevelHeadline>
              <CreateOptionForm />
            </div>
          )}
          {tab === 'relations' && (
            <div style={{ marginTop: '5rem', width: '100%' }}>
              <SecondLevelHeadline>Create relation</SecondLevelHeadline>
              <CreateRelationForm />
            </div>
          )}
        </Container>
      </Flex>
    </>
  )
}

export default ClaimTypesPage
