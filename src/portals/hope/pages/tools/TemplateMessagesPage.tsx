import React, { useState } from 'react'
import styled from '@emotion/styled'
import { FadeIn, MainHeadline, Flex, Button, Tabs } from '@hedvig-ui'
import { CreateTemplate } from '../../features/tools/template-messages/components/CreateTemplate'
import { SearchTemplate } from '../../features/tools/template-messages/components/SearchTemplate'
import { TemplateView } from '../../features/tools/template-messages/components/TemplateView'
import {
  Markets,
  TemplateMessage,
  useTemplateMessages,
} from '../../features/tools/template-messages/use-template-messages'

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

const getTemplates = () => {
  const templates = localStorage.getItem('hedvig:messages:templates')

  if (!templates) {
    return []
  }

  return JSON.parse(templates)
}

const TemplateMessagesPage = () => {
  const [isCreating, setIsCreating] = useState(false)
  const [templates, setTemplates] = useState<TemplateMessage[]>(() =>
    getTemplates(),
  )
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateMessage | null>(null)

  const {
    createTemplate,
    editTemplate,
    deleteTemplate,
    currentMarket,
    changeCurrentMarket,
  } = useTemplateMessages()

  const saveChangesHandler = (newTemplate: TemplateMessage) => {
    if (!selectedTemplate) {
      return
    }

    editTemplate(newTemplate)

    if (newTemplate.market !== currentMarket) {
      setTemplates((prev) =>
        prev.filter((template) => template.id !== newTemplate.id),
      )
      setSelectedTemplate(null)
    } else {
      setTemplates((prev) =>
        prev.map((template) => {
          if (template.id === newTemplate.id) {
            return newTemplate
          }
          return template
        }),
      )
    }
  }

  const createHandler = (template: TemplateMessage) => {
    createTemplate(template)

    if (template.market === currentMarket) {
      setTemplates((prev) => [...prev, template])
    }

    setIsCreating(false)
  }

  const deleteHandler = (id: string) => {
    deleteTemplate(id)
    setTemplates((prev) => prev.filter((template) => template.id !== id))
    setSelectedTemplate(null)
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
          list={Object.keys(Markets).map((tab) => ({
            active: currentMarket === Markets[tab],
            title: tab,
            action: () => {
              setSelectedTemplate(null)
              setTemplates(getTemplates())
              changeCurrentMarket(Markets[tab])
            },
          }))}
        />
        <Button onClick={() => setIsCreating(true)}>Create New Template</Button>
      </Flex>
      <Content>
        <SearchTemplate
          selected={selectedTemplate}
          onSelect={setSelectedTemplate}
          templates={templates?.filter(
            (template) => template.market === currentMarket,
          )}
        />
        {selectedTemplate && (
          <TemplateView
            template={selectedTemplate}
            onSave={saveChangesHandler}
            onDelete={deleteHandler}
          />
        )}
      </Content>
    </Container>
  )
}

export default TemplateMessagesPage
