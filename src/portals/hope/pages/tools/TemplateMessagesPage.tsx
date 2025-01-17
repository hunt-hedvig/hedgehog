import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { FadeIn, MainHeadline, Flex, Button, Tabs } from '@hedvig-ui'
import { CreateTemplate } from '../../features/template-messages/components/CreateTemplate'
import { SearchTemplate } from '../../features/template-messages/components/SearchTemplate'
import { TemplateView } from '../../features/template-messages/components/TemplateView'
import {
  uniquePickedLocales,
  useTemplateMessages,
} from 'portals/hope/features/template-messages/use-template-messages'
import { PickedLocaleMarket } from '../../features/config/constants'
import { Page } from 'portals/sos/pages/routes'
import { useConfirmDialog } from '@hedvig-ui'
import { Template, UpsertTemplateInput } from 'types/generated/graphql'

const Container = styled(FadeIn)`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const Content = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 25% 1fr;
  column-gap: 2rem;
  margin-top: 2rem;
`

const TemplateMessagesPage: Page = () => {
  const [isCreating, setIsCreating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  )

  const {
    templates,
    create: createTemplate,
    edit: editTemplate,
    delete: deleteTemplate,
    locale: currentLocale,
    setLocale: changeCurrentLocale,
  } = useTemplateMessages()

  useEffect(() => {
    if (selectedTemplate) {
      setSelectedTemplate(
        templates.find((template) => template.id === selectedTemplate.id) ||
          null,
      )
    }
  }, [templates])

  const { confirm } = useConfirmDialog()

  const saveChangesHandler = (newTemplate: Template) => {
    if (!selectedTemplate) {
      return
    }

    editTemplate(newTemplate)
  }

  const createHandler = (newTemplate: UpsertTemplateInput) => {
    createTemplate(newTemplate, () => setIsCreating(false))
  }

  const deleteHandler = (id: string) => {
    confirm('Are you sure you want to delete this message template?').then(
      () => {
        deleteTemplate(id)
        setSelectedTemplate(null)
      },
    )
  }

  if (isCreating) {
    return (
      <Container>
        <MainHeadline style={{ marginBottom: '2rem' }}>
          📋 Create New Template
        </MainHeadline>
        <CreateTemplate
          onClose={() => setIsCreating(false)}
          onCreate={createHandler}
        />
      </Container>
    )
  }

  return (
    <Container>
      <MainHeadline style={{ marginBottom: '2rem' }}>
        📋 Template Messages
      </MainHeadline>
      <Flex flex="0" align="center" justify="space-between">
        <Tabs
          style={{ width: '30%' }}
          list={uniquePickedLocales.map((locale) => ({
            active: currentLocale === locale,
            title:
              PickedLocaleMarket[locale].charAt(0) +
              PickedLocaleMarket[locale].toLowerCase().slice(1),
            action: () => {
              setSelectedTemplate(null)
              changeCurrentLocale(locale)
            },
          }))}
        />
        <Button onClick={() => setIsCreating(true)}>Create New Template</Button>
      </Flex>
      <Content>
        <SearchTemplate
          selected={selectedTemplate}
          onSelect={setSelectedTemplate}
          templates={templates}
        />
        {selectedTemplate && (
          <TemplateView
            template={selectedTemplate}
            onEdit={saveChangesHandler}
            onDelete={deleteHandler}
          />
        )}
      </Content>
    </Container>
  )
}

export default TemplateMessagesPage
