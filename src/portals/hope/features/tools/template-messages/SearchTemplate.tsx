import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Input } from '@hedvig-ui'
import { SearchIcon as InputIcon } from '../../members-search/styles'
import { FileText } from 'react-bootstrap-icons'
import { TemplateMessage } from './templates'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  height: 100%;
  max-height: 35rem;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.border};
  border-top: none;
`

const SearchIcon = styled(InputIcon)`
  width: 1rem;
  height: 1rem;
`

const SearchInput = styled(Input)`
  border-radius: unset;
`

const Item = styled.div<{ selected: boolean }>`
  padding: 0.5rem;

  display: flex;
  align-items: center;

  border-bottom: 1px solid ${({ theme }) => theme.border};

  background-color: ${({ selected, theme }) =>
    selected ? theme.accentLight : theme.background};

  cursor: pointer;

  & span {
    margin-left: 0.5rem;
    font-size: 0.875rem;
    padding-top: 1px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.accentLighter};
  }
`

export const SearchTemplate: React.FC<{
  selected: TemplateMessage | null
  templates: TemplateMessage[]
  onSelect: (template: TemplateMessage | null) => void
}> = ({ onSelect, selected, templates }) => {
  const [query, setQuery] = useState<string>()

  const selectHandler = (id: string) => {
    const selectedTemplate = templates.filter(
      (template) => template.id === id,
    )[0]
    onSelect(selectedTemplate)
  }

  return (
    <Container>
      <SearchInput
        style={{ borderRadius: 'unset' }}
        onChange={({ target: { value } }) => {
          setQuery(value)
        }}
        icon={<SearchIcon muted={!query} />}
        placeholder="Search Template"
        id="query"
        value={query}
        type="search"
        autoFocus
      />
      <Content>
        {templates
          .filter((template) =>
            query
              ? template.name.toLowerCase().includes(query.toLowerCase())
              : true,
          )
          .map((template) => (
            <TemplateItem
              key={template.id}
              id={template.id}
              name={template.name}
              onSelect={selectHandler}
              selected={selected?.id === template.id}
            />
          ))}
      </Content>
    </Container>
  )
}

const TemplateItem = ({ id, name, onSelect, selected }) => {
  return (
    <Item selected={selected} onClick={() => onSelect(id)}>
      <FileText />
      <span>{name}</span>
    </Item>
  )
}
