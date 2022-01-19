import React, { useState } from 'react'
import styled from '@emotion/styled'
import { FadeIn, MainHeadline, Flex, Button, Tabs } from '@hedvig-ui'
import { TemplateView } from '../../features/tools/template-messages/TemplateView'
import { SearchTemplate } from '../../features/tools/template-messages/SearchTemplate'
import { CreateTemplate } from '../../features/tools/template-messages/CreateTemplate'
import {
  Languages,
  TemplateMessage,
} from '../../features/tools/template-messages/templates'

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

  const onSaveHandler = () => {
    console.log(selectedTemplate)
    const currentTemplates = localStorage.getItem('hedvig:messages:templates')

    if (!currentTemplates || !selectedTemplate) {
      return
    }

    const parsedTemplates = JSON.parse(currentTemplates)
    const uniqueTemplates = parsedTemplates.filter(
      (template) => template.id !== selectedTemplate.id,
    )

    localStorage.setItem(
      'hedvig:messages:templates',
      JSON.stringify([...uniqueTemplates, selectedTemplate]),
    )
    setTemplates((prev) =>
      prev.filter((template) => template.id !== selectedTemplate.id),
    )
  }

  if (isCreating) {
    return (
      <Container>
        <MainHeadline style={{ marginBottom: '2rem' }}>
          📋 Create New Template
        </MainHeadline>
        <CreateTemplate onClose={() => setIsCreating(false)} />
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
          language={language}
          selected={selectedTemplate}
          onSelect={setSelectedTemplate}
          templates={templates}
        />
        <TemplateView
          template={selectedTemplate}
          onChange={onChangeHandler}
          onSave={onSaveHandler}
        />
      </Content>
    </Container>
  )
}

export default TemplateMessagesPage
