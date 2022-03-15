import React, { useRef, useState } from 'react'
import styled from '@emotion/styled'
import { useClickOutside } from '@hedvig-ui/hooks/use-click-outside'
import { keyframes } from '@emotion/react'
import { TemplateForm } from './TemplateForm'
import { SearchIcon } from '../../members-search/styles'
import { Input, Tabs, Button, SecondLevelHeadline } from '@hedvig-ui'
import {
  Pen as EditIcon,
  PinAngle,
  PinAngleFill,
  Trash,
} from 'react-bootstrap-icons'
import { formatLocale, useTemplateMessages } from '../use-template-messages'
import { Template, UpsertTemplateInput } from 'types/generated/graphql'
import { PickedLocale, PickedLocaleMarket } from '../../config/constants'

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

  & h2 {
    color: ${({ theme }) => theme.foreground};
  }
`

const Header = styled.div`
  padding: 20px 15px 0 15px;
  background-color: ${({ theme }) => theme.background};
`

const HeaderBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 1rem;
`

const Content = styled.div`
  padding: 15px;
  margin-bottom: 6rem;
  overflow-y: auto;
  flex: 1;
`

const Bottom = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;

  width: 100%;

  background-color: ${({ theme }) => theme.background};

  padding: 15px;

  font-size: 14px;

  color: ${({ theme }) => theme.foreground};

  & span {
    color: ${({ theme }) => theme.accent};
    cursor: pointer;
  }
`

export const EmptyContainer = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.placeholderColor};
  font-size: 12px;
`

export const TemplateMessagesModal: React.FC<{
  hide: () => void
}> = ({ hide }) => {
  const [query, setQuery] = useState('')
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [closing, setClosing] = useState(false)
  const [isPinnedTab, setIsPinnedTab] = useState(false)

  const {
    select,
    templates,
    create: createTemplate,
    edit: editTemplate,
    delete: deleteTemplate,
    pin: pinTemplate,
    locale: currentLocale,
    memberId,
    currentLocaleDisplayed,
    changeLocaleDisplayed,
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
    const selectedTemplate = templates.find((template) => template.id === id)

    if (!selectedTemplate) {
      return
    }

    if (currentLocaleDisplayed?.isEnglishLocale) {
      select(
        selectedTemplate.messages.find(
          (message) =>
            message.language === formatLocale(PickedLocale.EnSe, true),
        )?.message || '',
      )

      return
    }

    select(
      selectedTemplate.messages.find(
        (message) => message.language === formatLocale(currentLocale),
      )?.message || '',
    )
  }

  const deleteHandler = (id: string) => {
    deleteTemplate(id)
  }

  const editHandler = (id: string) => {
    const selectedTemplate = templates.filter(
      (template) => template.id === id,
    )[0]
    setEditingTemplate(selectedTemplate)
  }

  const pinHandler = (id: string) => {
    pinTemplate(id)
  }

  const switchMarketHandler = () => {
    if (!memberId) {
      return
    }

    const message = `By switching this setting, The default language used by this member will be changing to ${
      currentLocaleDisplayed?.isEnglishLocale
        ? PickedLocaleMarket[currentLocale]
        : 'ENGLISH'
    }`

    if (confirm(message)) {
      changeLocaleDisplayed(memberId)
    }
  }

  const getFilteredTemplates = () =>
    templates
      .filter((template) =>
        query
          ? template.title.toLowerCase().includes(query.toLowerCase())
          : true,
      )
      .filter((template) => (isPinnedTab ? template.pinned : true))

  if (isCreating) {
    return (
      <Container
        ref={templatesRef}
        closing={closing}
        style={{ padding: 15, overflowY: 'auto' }}
      >
        <SecondLevelHeadline>Create Template</SecondLevelHeadline>
        <TemplateForm
          defaultLocale={currentLocale}
          isModal
          isCreating
          onCreate={(newTemplate: UpsertTemplateInput) => {
            createTemplate(newTemplate, () => setIsCreating(false))
          }}
          onClose={() => {
            setIsCreating(false)
          }}
        />
      </Container>
    )
  }

  if (editingTemplate) {
    return (
      <Container
        ref={templatesRef}
        closing={closing}
        style={{ padding: 15, overflowY: 'auto' }}
      >
        <SecondLevelHeadline>Edit Template</SecondLevelHeadline>
        <TemplateForm
          isModal
          isCreating={false}
          template={editingTemplate}
          onEdit={(newTemplate: Template) => {
            editTemplate(newTemplate)
            setEditingTemplate(null)
          }}
          onClose={() => {
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
                title: `${
                  templates.filter((template) => template.pinned).length
                } Pinned`,
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
        {getFilteredTemplates()?.length ? (
          getFilteredTemplates().map((template) => (
            <TemplateItem
              key={template.id}
              id={template.id}
              name={template.title}
              text={
                currentLocaleDisplayed?.isEnglishLocale
                  ? template.messages.find(
                      (msg) =>
                        msg.language === formatLocale(PickedLocale.EnSe, true),
                    )?.message || ''
                  : template.messages.find(
                      (msg) => msg.language === formatLocale(currentLocale),
                    )?.message || ''
              }
              pinned={template.pinned || false}
              onSelect={selectHandler}
              onDelete={deleteHandler}
              onEdit={editHandler}
              onPin={pinHandler}
            />
          ))
        ) : (
          <EmptyContainer>No records found</EmptyContainer>
        )}
      </Content>
      <Bottom onClick={switchMarketHandler}>
        This user speaks in another language instead?
        <br />
        <span>Switch Language</span>
      </Bottom>
    </Container>
  )
}

const TemplateContainer = styled.div`
  padding: 10px;

  background-color: ${({ theme }) => theme.backgroundLight};
  border-radius: 0.5rem;

  max-height: 10rem;

  display: flex;
  flex-direction: column;

  & * {
    font-size: 1rem;
    color: ${({ theme }) => theme.foreground};
  }

  &:not(:last-child) {
    margin-bottom: 0.625rem;
  }

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.background};
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

interface TemplateItemProps {
  id: string
  name: string
  text: string
  pinned: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string) => void
  onPin: (id: string) => void
}

const TemplateItem = ({
  id,
  name,
  text,
  pinned,
  onSelect,
  onDelete,
  onEdit,
  onPin,
}: TemplateItemProps) => {
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
            {pinned ? (
              <PinAngleFill onClick={() => onPin(id)} />
            ) : (
              <PinAngle onClick={() => onPin(id)} />
            )}
            <Trash
              onClick={() => {
                // Don't work useConfirmDialog in some reason
                if (
                  confirm(
                    'Are you sure you want to delete this message template?',
                  )
                ) {
                  onDelete(id)
                }
              }}
            />
          </TemplateActions>
        )}
      </TemplateTop>
      <TemplateContent>
        {text || (
          <EmptyContainer style={{ textAlign: 'start', fontSize: '1rem' }}>
            (no one has written for this language yet..)
          </EmptyContainer>
        )}
      </TemplateContent>
    </TemplateContainer>
  )
}