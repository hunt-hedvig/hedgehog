import {
  Button,
  Checkbox,
  Flex,
  Input,
  Label,
  MainHeadline,
  Paragraph,
  Spacing,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { useTitle } from '@hedvig-ui'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useGetMeQuery, useUpdateUserMutation } from 'types/generated/graphql'
import { Page } from 'portals/hope/pages/routes'
import { AvailablePortals } from 'auth/components/AvailablePortals'
import { useMyMarkets } from 'portals/hope/common/hooks/use-my-markets'
import { Market, MarketFlags } from 'portals/hope/features/config/constants'
import { convertEnumOrSentenceToTitle } from '@hedvig-ui'

const ProfilePage: Page = () => {
  const { data } = useGetMeQuery()
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState<null | string>('')
  const [updateUser] = useUpdateUserMutation()
  const { markets, addMarket, removeMarket } = useMyMarkets()

  const portals = data?.me.availablePortals ?? []
  const currentPortal = data?.me.portal ?? ''

  const handleSaveChanges = () => {
    if (!data) {
      return
    }

    toast.promise(
      updateUser({
        variables: {
          input: {
            fullName,
            phoneNumber,
          },
        },
        optimisticResponse: {
          updateUser: {
            __typename: 'User',
            ...data.me.user,
            fullName,
            phoneNumber,
          },
        },
      }),
      {
        loading: 'Updating user',
        success: 'User updated',
        error: 'Could not update user',
      },
    )
  }

  const reset = () => {
    setFullName(data?.me.user.fullName ?? '')
    setPhoneNumber(data?.me.user.phoneNumber ?? null)
  }

  useEffect(reset, [data])

  useTitle('Profile')

  const changes =
    fullName !== data?.me.user.fullName ||
    phoneNumber !== data.me.user.phoneNumber

  if (!data) {
    return null
  }

  return (
    <>
      <MainHeadline>Settings</MainHeadline>
      <Spacing top="large" />
      <div>
        <ThirdLevelHeadline>Profile</ThirdLevelHeadline>
        <Flex direction="column">
          <form
            style={{ width: '100%', maxWidth: '350px' }}
            onSubmit={(e) => {
              e.preventDefault()
              handleSaveChanges()
            }}
          >
            <Label>Full name</Label>
            <Input
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.currentTarget.value)}
            />
            <Spacing top="small" />
            <Label>Phone</Label>
            <Input
              placeholder="+46701234567"
              value={phoneNumber ?? ''}
              onChange={(e) => setPhoneNumber(e.currentTarget.value)}
            />
            <Spacing top="small" />
            <Label>E-mail</Label>
            <Input
              disabled
              muted={true}
              value={data.me.user.email}
              placeholder="example@hedvig.com"
            />
            <Spacing top="medium" />
            <Flex direction="row">
              <Button type="submit" disabled={!changes || !fullName}>
                Save changes
              </Button>
              {changes && (
                <Button
                  variant="tertiary"
                  style={{ marginLeft: '1em' }}
                  onClick={reset}
                >
                  Reset
                </Button>
              )}
            </Flex>
          </form>
        </Flex>
      </div>
      <>
        <Spacing top="large" />
        <div>
          <ThirdLevelHeadline>Markets</ThirdLevelHeadline>
          <Paragraph secondary style={{ fontSize: '1rem' }}>
            These are your focus markets and will be used to customize your
            workflow
          </Paragraph>
          <Flex
            style={{
              flexWrap: 'wrap',
              marginTop: '0.25rem',
              marginBottom: '2.5rem',
              maxWidth: '30rem',
            }}
            justify="space-between"
          >
            {Object.values(Market).map((market) => {
              const checked = markets.includes(market)

              return (
                <Checkbox
                  key={market}
                  style={{ width: '30%', marginTop: '0.25rem' }}
                  label={`${convertEnumOrSentenceToTitle(market)} ${
                    MarketFlags[market]
                  }`}
                  checked={checked}
                  onChange={() =>
                    checked ? removeMarket(market) : addMarket(market)
                  }
                />
              )
            })}
          </Flex>
        </div>
      </>
      {portals.length > 1 && (
        <>
          <Spacing top="large" />
          <div>
            <ThirdLevelHeadline>Portals</ThirdLevelHeadline>
            <Flex fullWidth>
              <AvailablePortals
                portals={portals}
                currentPortal={currentPortal}
              />
            </Flex>
          </div>
        </>
      )}
    </>
  )
}

export default ProfilePage
