import React from 'react'
import { AvailablePortals } from 'auth/components/AvailablePortals'
import { FadeIn, Flex, MainHeadline } from '@hedvig-ui'
import { useAuthenticationQuery } from 'types/generated/graphql'
import { useHistory } from 'react-router'

export const PortalsPage: React.FC = () => {
  const history = useHistory()
  const { data } = useAuthenticationQuery()

  const portals = data?.me.availablePortals ?? []
  const currentPortal = data?.me.portal ?? ''

  if (data?.me && portals.length <= 1) {
    history.push('/')
    return null
  }

  return (
    <>
      <FadeIn
        style={{
          marginTop: 'calc(35vh - 2rem)',
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        <MainHeadline>Portals</MainHeadline>
      </FadeIn>
      <Flex justify="center" fullWidth>
        <AvailablePortals
          portals={portals}
          currentPortal={currentPortal}
          maxWidth="80vh"
        />
      </Flex>
    </>
  )
}
