import React from 'react'
import { Page } from 'portals/hope/pages/routes'
import { Row } from 'portals/hope/features/tools/employees/components/CreateEmployee'
import { MainHeadline } from '@hedvig-ui'
import { AuthApplicationTable } from 'portals/hope/features/tools/auth-admin/components/AuthApplicationTable'
import { CreateAuthApplication } from 'portals/hope/features/tools/auth-admin/components/CreateAuthApplication'
import styled from '@emotion/styled'

const Wrapper = styled.div`
  width: fit-content;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
`

const StyledRow = styled(Row)`
  width: 100%;
  justify-content: space-between;
`

const AuthAdminPage: Page = () => {
  return (
    <>
      <Wrapper>
        <StyledRow style={{ justifyContent: 'space-between', width: '100%' }}>
          <MainHeadline>Applications</MainHeadline>
          <CreateAuthApplication />
        </StyledRow>
        <AuthApplicationTable />
      </Wrapper>
    </>
  )
}

export default AuthAdminPage
