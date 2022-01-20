import React, { useRef, useState } from 'react'
import styled from '@emotion/styled'
import { useClickOutside } from '@hedvig-ui/hooks/use-click-outside'
import { keyframes } from '@emotion/react'
import { Languages, TemplateForm, TemplateMessage } from './TemplateForm'
import { SearchIcon } from '../../../members-search/styles'
import { Input, Tabs, Button, SecondLevelHeadline } from '@hedvig-ui'

const show = keyframes`
  from {
    right: -20%;
  }

  to {
    right: 0;
  }
`

const hide = keyframes`
  from {
    right: 0;
  }

  to {
    right: -20%;
  }
`

const Container = styled.div<{ closing: boolean }>`
  transition: right 400ms;

  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;

  width: 20%;
  height: 100%;

  background-color: ${({ theme }) => theme.accentBackground};
  box-shadow: -6px 0px 14px 0px rgba(34, 60, 80, 0.2);

  animation: ${({ closing }) => (closing ? hide : show)} 400ms;

  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  padding: 20px 15px 0 15px;
`

const HeaderBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 1rem;
`

const Content = styled.div`
  padding: 15px;
  overflow-y: scroll;
  flex: 1;
`

const getTemplates = (language: Languages) => {
  const templates = localStorage.getItem('hedvig:messages:templates')

  if (!templates) {
    return null
  }

  const parsedTemplates = JSON.parse(templates)
  return parsedTemplates.filter((template) => template.market === language)
}

export const TemplateMessages: React.FC<{
  hide: () => void
}> = ({ hide }) => {
  const [language] = useState<Languages>(Languages.Sweden)
  const [query, setQuery] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [closing, setClosing] = useState(false)
  const [templates, setTemplates] = useState<TemplateMessage[]>(() =>
    getTemplates(language),
  )

  const templatesRef = useRef<HTMLDivElement>(null)

  const smoothHideHandler = () => {
    setClosing(true)
    setTimeout(() => {
      hide()
      setClosing(false)
    }, 350)
  }

  useClickOutside(templatesRef, smoothHideHandler)

  const selectHandler = (id: string) => {
    console.log(id)
  }

  if (isCreating) {
    return (
      <Container ref={templatesRef} closing={closing} style={{ padding: 15 }}>
        <SecondLevelHeadline>Create Template</SecondLevelHeadline>
        <TemplateForm
          isCreating
          template={{
            id: '',
            name: '',
            message: '',
            messageEn: '',
            market: Languages.Sweden,
          }}
          onChange={() => {}}
          onSave={() => {}}
          onClose={() => setIsCreating(false)}
        />
      </Container>
    )
  }

  return (
    <Container ref={templatesRef} closing={closing}>
      <Header>
        <Input
          style={{ borderRadius: 'unset' }}
          onChange={({ target: { value } }) => {
            setQuery(value)
          }}
          icon={
            <SearchIcon
              muted={false}
              style={{ width: '1rem', height: '1rem' }}
            />
          }
          placeholder="Search Template"
          id="query"
          value={query}
          type="search"
          autoFocus
        />
        <HeaderBottom>
          <Tabs
            style={{ width: '50%' }}
            list={[
              {
                active: true,
                title: 'All Templates',
                action: () => {},
              },
              {
                active: false,
                title: '7 Pinned',
                action: () => {},
              },
            ]}
          />
          <Button
            variant="tertiary"
            size="small"
            onClick={() => setIsCreating(true)}
          >
            + new template
          </Button>
        </HeaderBottom>
      </Header>
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
              text={template.messageEn}
              onSelect={selectHandler}
            />
          ))}
      </Content>
    </Container>
  )
}

const TemplateContainer = styled.div`
  padding: 10px;

  background-color: ${({ theme }) => theme.background};
  border-radius: 0.5rem;

  height: 10rem;

  display: flex;
  flex-direction: column;

  & * {
    font-size: 1rem;
  }

  &:not(:last-child) {
    margin-bottom: 0.625rem;
  }
`

const TemplateTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 0.3rem;

  & * {
    font-weight: bold;
  }
`

const TemplateContent = styled.div`
  flex: 1;
  overflow: hidden;
`

const TemplateItem = ({ id, name, text, onSelect }) => {
  return (
    <TemplateContainer onClick={() => onSelect(id)}>
      <TemplateTop>
        <h3>{name}</h3>
      </TemplateTop>
      <TemplateContent>{text}</TemplateContent>
    </TemplateContainer>
  )
}
