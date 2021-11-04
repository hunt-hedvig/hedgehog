import styled from '@emotion/styled'
import { Flex, Modal, Shadowed, Tabs } from '@hedvig-ui'
import chroma from 'chroma-js'
import { RoleAccessList } from 'features/resource-access/overview/components/RoleAccessList'
import { UserAccessList } from 'features/resource-access/overview/components/UserAccessList'
import { useMe } from 'features/user/hooks/use-me'
import React, { useState } from 'react'
import { useResourceAccessInformationQuery } from 'types/generated/graphql'

const Footer = styled(Flex)`
  font-size: 0.85rem;
  margin-top: 0.2rem;
  padding: 1rem;
  color: ${({ theme }) =>
    chroma(theme.foreground)
      .alpha(0.7)
      .hex()};
`

export const ResourceAccessOverview: React.FC<{
  onClose: () => void
  resourceId: string
}> = ({ onClose, resourceId }) => {
  const { data } = useResourceAccessInformationQuery({
    variables: { resourceId },
  })
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users')

  const { me } = useMe()

  if (!data?.resourceAccess) {
    return null
  }

  const isUserThatRestricted =
    data.resourceAccess?.restrictedBy.email === me.email

  return (
    <Modal withoutHeader onClose={onClose}>
      <Tabs
        style={{ margin: '1rem 0', padding: '0rem 1rem' }}
        list={[
          {
            title: 'Users',
            action: () => {
              setActiveTab('users')
            },
            active: activeTab === 'users',
          },

          {
            title: 'Roles',
            action: () => {
              setActiveTab('roles')
            },
            active: activeTab === 'roles',
          },
        ]}
      />
      <Flex
        style={{
          width: '500px',
          height: '400px',
          padding: '0rem 1rem',
          overflowY: 'scroll',
        }}
        direction="column"
      >
        {activeTab === 'users' && (
          <UserAccessList
            canGrant={isUserThatRestricted}
            resourceAccessInformation={data.resourceAccess}
            resourceId={resourceId}
          />
        )}
        {activeTab === 'roles' && (
          <RoleAccessList
            canGrant={isUserThatRestricted}
            resourceAccessInformation={data.resourceAccess}
            resourceId={resourceId}
          />
        )}
      </Flex>

      {!isUserThatRestricted && (
        <Footer justify="center" align="center">
          Only{' '}
          <Shadowed style={{ margin: '0 0.2rem' }}>
            {data.resourceAccess.restrictedBy.fullName}
          </Shadowed>{' '}
          can grant access to new users
        </Footer>
      )}
    </Modal>
  )
}
