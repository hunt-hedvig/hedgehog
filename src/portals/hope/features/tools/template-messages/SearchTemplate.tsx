import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import {
  Languages,
  TemplateMessage,
} from 'portals/hope/pages/tools/TemplateMessagesPage'
import { Input } from '@hedvig-ui'
import { SearchIcon as InputIcon } from '../../members-search/styles'
import { FileText } from 'react-bootstrap-icons'
import { denmarkTemplates, norwayTemplates, swedenTemplates } from './templates'

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

const Item = styled.div`
  padding: 0.5rem;

  display: flex;
  align-items: center;

  border-bottom: 1px solid ${({ theme }) => theme.border};

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

const getTemplates = (language: Languages) =>
  language === Languages.Denmark
    ? denmarkTemplates
    : language === Languages.Norway
    ? norwayTemplates
    : swedenTemplates

export const SearchTemplate: React.FC<{
  language: Languages
  selected: TemplateMessage | null
  onSelect: (template: TemplateMessage) => void
}> = ({ language }) => {
  const [currentTemplates, setCurrentTemplates] = useState(
    getTemplates(language),
  )
  const [query, setQuery] = useState<string>()

  useEffect(() => {
    if (query) {
      setCurrentTemplates((prev) =>
        prev.filter((template) => template.name.includes(query)),
      )
    } else {
      setCurrentTemplates(getTemplates(language))
    }
  }, [query])

  useEffect(() => {
    if (!query) {
      setCurrentTemplates(getTemplates(language))
      return
    }

    const templates = getTemplates(language)
    setCurrentTemplates(
      templates.filter((template) => template.name.includes(query)),
    )
  }, [language])

  const selectHandler = (id: string) => {
    console.log(id)
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
        {currentTemplates.map((template) => (
          <TemplateItem
            id={template.id}
            name={template.name}
            onSelect={selectHandler}
          />
        ))}
      </Content>
    </Container>
  )
}

const TemplateItem = ({ id, name, onSelect }) => {
  return (
    <Item onClick={() => onSelect(id)}>
      <FileText />
      <span>{name}</span>
    </Item>
  )
}
