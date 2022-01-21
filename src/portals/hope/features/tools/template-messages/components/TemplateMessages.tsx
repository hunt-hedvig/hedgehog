import React, { useRef, useState } from 'react'
import styled from '@emotion/styled'
import { useClickOutside } from '@hedvig-ui/hooks/use-click-outside'
import { keyframes } from '@emotion/react'
import { TemplateForm } from './TemplateForm'
import { SearchIcon } from '../../../members-search/styles'
import { Input, Tabs, Button, SecondLevelHeadline } from '@hedvig-ui'
import { Pen as EditIcon, PinAngle, Trash } from 'react-bootstrap-icons'
import {
  Languages,
  TemplateMessage,
  useTemplateMessages,
} from '../use-template-messages'

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

  background-color: ${({ theme }) => theme.background};
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

const getTemplates = () => {
  const templates = localStorage.getItem('hedvig:messages:templates')

  if (!templates) {
    return null
  }

  return JSON.parse(templates)
}

export const TemplateMessages: React.FC<{
  hide: () => void
}> = ({ hide }) => {
  const [query, setQuery] = useState('')
  const [editingTemplate, setEditingTemplate] =
    useState<TemplateMessage | null>(null)
  const [newTemplate, setNewTemplate] = useState<TemplateMessage>({
    id: '',
    name: '',
    message: '',
    messageEn: '',
    market: Languages.Sweden,
  })
  const [isCreating, setIsCreating] = useState(false)
  const [closing, setClosing] = useState(false)
  const [templates, setTemplates] = useState<TemplateMessage[]>(() =>
    getTemplates(),
  )
  const [isPinnedTab, setIsPinnedTab] = useState(false)

  const {
    select,
    createTemplate,
    editTemplate,
    deleteTemplate,
    pinTemplate,
    currentMarket,
  } = useTemplateMessages()

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
    const selectedTemplate = templates.filter(
      (template) => template.id === id,
    )[0]
    select(selectedTemplate.message)
  }

  const deleteHandler = (id: string) => {
    deleteTemplate(id)
    setTemplates((prev) => prev.filter((template) => template.id !== id))
  }

  const editHandler = (id: string) => {
    const selectedTemplate = templates.filter(
      (template) => template.id === id,
    )[0]
    setEditingTemplate(selectedTemplate)
  }

  const pinHandler = (id: string) => {
    pinTemplate(id)
    setTemplates((prev) =>
      prev.map((template) => {
        if (template.id === id) {
          return { ...template, pinned: template.pinned ? false : true }
        }

        return template
      }),
    )
  }

  const changeHandler = (field: string, value?: string | number | boolean) => {
    if (isCreating && !editingTemplate) {
      setNewTemplate((prev) => ({ ...prev, [field]: value }))
    } else {
      const newTemplate = { ...editingTemplate, [field]: value }
      setEditingTemplate(newTemplate as TemplateMessage)
    }
  }

  const saveHandler = () => {
    if (isCreating) {
      const id = createTemplate(newTemplate)
      const template = { ...newTemplate, id }

      setTemplates((prev) => [...prev, template as TemplateMessage])

      setIsCreating(false)
    } else if (editingTemplate) {
      editTemplate(editingTemplate)

      setTemplates((prev) =>
        prev.map((template) => {
          if (template.id === editingTemplate.id) {
            return editingTemplate
          }

          return template
        }),
      )

      setEditingTemplate(null)
    }
  }

  if (isCreating || !!editingTemplate) {
    return (
      <Container ref={templatesRef} closing={closing} style={{ padding: 15 }}>
        <SecondLevelHeadline>Create Template</SecondLevelHeadline>
        <TemplateForm
          isCreating={isCreating}
          template={
            editingTemplate && !isCreating ? editingTemplate : newTemplate
          }
          onChange={changeHandler}
          onSave={saveHandler}
          onClose={() => {
            setIsCreating(false)
            setEditingTemplate(null)
          }}
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
                active: !isPinnedTab,
                title: 'All Templates',
                action: () => {
                  setIsPinnedTab(false)
                },
              },
              {
                active: isPinnedTab,
                title:
                  templates
                    ?.filter((template) => template.pinned)
                    .length.toString() || '0' + ' Pinned',
                action: () => {
                  setIsPinnedTab(true)
                },
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
        {templates?.length
          ? templates
              .filter((template) =>
                query
                  ? template.name.toLowerCase().includes(query.toLowerCase())
                  : true,
              )
              .filter((template) => template.market === currentMarket)
              .filter((template) =>
                isPinnedTab ? template.pinned : !template.pinned,
              )
              .map((template) => (
                <TemplateItem
                  key={template.id}
                  id={template.id}
                  name={template.name}
                  text={template.messageEn}
                  onSelect={selectHandler}
                  onDelete={deleteHandler}
                  onEdit={editHandler}
                  onPin={pinHandler}
                />
              ))
          : null}
      </Content>
    </Container>
  )
}

const TemplateContainer = styled.div`
  padding: 10px;

  background-color: ${({ theme }) => theme.backgroundLight};
  border: 1px solid ${({ theme }) => theme.border};
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

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.accentBackground};
  }
`

const TemplateTop = styled.div`
  display: grid;
  align-items: center;

  grid-template-columns: 1fr 4rem;
  column-gap: 1rem;

  margin-bottom: 0.3rem;

  & h3 {
    margin: 0;
  }

  & * {
    font-weight: bold;
  }
`

const TemplateContent = styled.div`
  flex: 1;
  overflow: hidden;
`

const TemplateActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & * {
    transition: none !important;
  }

  & svg:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.placeholderColor};
  }
`

const TemplateItem = ({
  id,
  name,
  text,
  onSelect,
  onDelete,
  onEdit,
  onPin,
}) => {
  const [isHover, setIsHover] = useState(false)

  return (
    <TemplateContainer
      onClick={() => onSelect(id)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <TemplateTop>
        <h3>{name}</h3>
        {isHover && (
          <TemplateActions>
            <EditIcon onClick={() => onEdit(id)} />
            <PinAngle onClick={() => onPin(id)} />
            <Trash onClick={() => onDelete(id)} />
          </TemplateActions>
        )}
      </TemplateTop>
      <TemplateContent>{text}</TemplateContent>
    </TemplateContainer>
  )
}
