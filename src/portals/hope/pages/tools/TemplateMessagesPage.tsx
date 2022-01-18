import React, { useState } from 'react'
import styled from '@emotion/styled'
import { FadeIn, MainHeadline, Flex, Button, Tabs } from '@hedvig-ui'
import { CreateTemplate } from '../../features/tools/template-messages/CreateTemplate'
import { SearchTemplate } from '../../features/tools/template-messages/SearchTemplate'

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
  const [language, setLanguage] = useState<'sweden' | 'denmark' | 'norway'>(
    'sweden',
  )

  const createNewTemplateHandler = () => {
    console.log('Creating Template')
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
              active: language === 'sweden',
              action: () => {
                setLanguage(`sweden`)
              },
              title: 'Sweden',
            },
            {
              active: language === 'denmark',
              action: () => {
                setLanguage(`denmark`)
              },
              title: 'Denmark',
            },
            {
              active: language === 'norway',
              action: () => {
                setLanguage(`norway`)
              },
              title: 'Norway',
            },
          ]}
        />
        <Button onClick={createNewTemplateHandler}>Create New Template</Button>
      </Flex>
      <Content>
        <SearchTemplate language={language} />
        <CreateTemplate language={language} />
      </Content>
    </Container>
  )
}

export default TemplateMessagesPage
