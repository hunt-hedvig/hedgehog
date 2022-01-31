import React, { useState } from 'react'
import styled from '@emotion/styled'
import { FadeIn, MainHeadline, Flex, Button, Tabs } from '@hedvig-ui'
import { CreateTemplate } from '../../features/template-messages/components/CreateTemplate'
import { SearchTemplate } from '../../features/template-messages/components/SearchTemplate'
import { TemplateView } from '../../features/template-messages/components/TemplateView'
import {
  TemplateMessages,
  useTemplateMessages,
} from 'portals/hope/features/template-messages/use-template-messages'
import { Market } from '../../features/config/constants'
import { Page } from 'portals/sos/pages/routes'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'

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
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateMessages | null>(null)

  const {
    templates,
    create: createTemplate,
    edit: editTemplate,
    delete: deleteTemplate,
    market: currentMarket,
    setMarket: changeCurrentMarket,
  } = useTemplateMessages()

  const { confirm } = useConfirmDialog()

  const saveChangesHandler = (newTemplate: TemplateMessages) => {
    if (!selectedTemplate) {
      return
    }

    editTemplate(newTemplate)
  }

  const createHandler = (newTemplate: TemplateMessages) => {
    createTemplate(newTemplate)

    setIsCreating(false)
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
          list={[
            {
              active: currentMarket === Market.Sweden,
              title: 'Sweden',
              action: () => {
                setSelectedTemplate(null)
                changeCurrentMarket(Market.Sweden)
              },
            },
            {
              active: currentMarket === Market.Denmark,
              title: 'Denmark',
              action: () => {
                setSelectedTemplate(null)
                changeCurrentMarket(Market.Denmark)
              },
            },
            {
              active: currentMarket === Market.Norway,
              title: 'Norway',
              action: () => {
                setSelectedTemplate(null)
                changeCurrentMarket(Market.Norway)
              },
            },
          ]}
        />
        <Button onClick={() => setIsCreating(true)}>Create New Template</Button>
      </Flex>
      <Content>
        <SearchTemplate
          selected={selectedTemplate}
          onSelect={setSelectedTemplate}
          templates={templates?.filter((template) =>
            template.market.includes(currentMarket),
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
