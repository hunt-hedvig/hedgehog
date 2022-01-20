import React, { useState } from 'react'
import styled from '@emotion/styled'
import { FadeIn, MainHeadline, Flex, Button, Tabs } from '@hedvig-ui'
import { v4 as uuidv4 } from 'uuid'
import {
  Languages,
  TemplateMessage,
} from '../../features/tools/template-messages/components/TemplateForm'
import { CreateTemplate } from '../../features/tools/template-messages/components/CreateTemplate'
import { SearchTemplate } from '../../features/tools/template-messages/components/SearchTemplate'
import { TemplateView } from '../../features/tools/template-messages/components/TemplateView'

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

const getTemplates = (language: Languages) => {
  const templates = localStorage.getItem('hedvig:messages:templates')

  if (!templates) {
    return null
  }

  const parsedTemplates = JSON.parse(templates)
  return parsedTemplates.filter((template) => template.market === language)
}

const TemplateMessagesPage = () => {
  const [language, setLanguage] = useState<Languages>(Languages.Sweden)
  const [isCreating, setIsCreating] = useState(false)
  const [templates, setTemplates] = useState<TemplateMessage[]>(() =>
    getTemplates(language),
  )
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateMessage | null>(null)

  const onChangeHandler = (
    field: string,
    value?: string | boolean | number,
  ) => {
    const newTemplate = { ...selectedTemplate, [field]: value }
    setSelectedTemplate(newTemplate as TemplateMessage)
  }

  const saveChangesHandler = () => {
    const allTemplates = localStorage.getItem('hedvig:messages:templates')

    if (!selectedTemplate || !allTemplates) {
      return
    }

    localStorage.setItem(
      'hedvig:messages:templates',
      JSON.stringify([
        ...JSON.parse(allTemplates).map((template) => {
          if (template.id === selectedTemplate.id) {
            return selectedTemplate
          }
          return template
        }),
      ]),
    )

    if (selectedTemplate.market !== language) {
      setTemplates((prev) =>
        prev.filter((template) => template.id !== selectedTemplate.id),
      )
      setSelectedTemplate(null)
    }
  }

  const createHandler = (template: TemplateMessage) => {
    const allTemplates = localStorage.getItem('hedvig:messages:templates')
    const newTemplate = { ...template, id: uuidv4() }

    if (!allTemplates) {
      localStorage.setItem(
        'hedvig:messages:templates',
        JSON.stringify([newTemplate]),
      )

      setIsCreating(false)
      return
    }

    const newTemplates = [...JSON.parse(allTemplates), newTemplate]
    localStorage.setItem(
      'hedvig:messages:templates',
      JSON.stringify(newTemplates),
    )
    if (newTemplate.market === language) {
      setTemplates((prev) => [...prev, newTemplate])
    }
    setIsCreating(false)
  }

  const deleteHandler = (id: string) => {
    const allTemplates = localStorage.getItem('hedvig:messages:templates')

    if (!allTemplates) {
      return
    }

    const newTemplates = JSON.parse(allTemplates).filter(
      (template) => template.id !== id,
    )

    localStorage.setItem(
      'hedvig:messages:templates',
      JSON.stringify(newTemplates),
    )
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
          list={Object.keys(Languages).map((tab) => ({
            active: language === Languages[tab],
            title: tab,
            action: () => {
              setTemplates(getTemplates(Languages[tab]))
              setLanguage(Languages[tab])
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
            onChange={onChangeHandler}
            onSave={saveChangesHandler}
            onDelete={deleteHandler}
          />
        )}
      </Content>
    </Container>
  )
}

export default TemplateMessagesPage
