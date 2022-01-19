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

const TemplateMessagesPage = () => {
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateMessage | null>(null)
  const [language, setLanguage] = useState<Languages>(Languages.Sweden)
  const [isCreating, setIsCreating] = useState(false)

  const onChangeHandler = (field: string, value: string) => {
    setSelectedTemplate((prev) => ({ ...prev, [field]: value }))
  }

  const onSaveHandler = () => {
    console.log(selectedTemplate)
  }

  if (isCreating) {
    return (
      <Container>
        <MainHeadline style={{ marginBottom: '2rem' }}>
          📋 Create New Template
        </MainHeadline>
        <CreateTemplate />
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
            action: () => setLanguage(Languages[tab]),
          }))}
        />
        <Button onClick={() => setIsCreating(true)}>Create New Template</Button>
      </Flex>
      <Content>
        <SearchTemplate
          language={language}
          selected={selectedTemplate}
          onSelect={setSelectedTemplate}
        />
        <TemplateView
          language={language}
          template={selectedTemplate}
          onChange={onChangeHandler}
          onSave={onSaveHandler}
        />
      </Content>
    </Container>
  )
}

export default TemplateMessagesPage
