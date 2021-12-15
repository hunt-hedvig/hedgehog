import { Button, Flex, Input, Label, MainHeadline, Spacing } from '@hedvig-ui'
import { useTitle } from '@hedvig-ui/hooks/use-title'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useGetMeQuery, useUpdateUserMutation } from 'types/generated/graphql'
import { Page } from 'pages/routes'

const ProfilePage: Page = () => {
  const { data } = useGetMeQuery()
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState<null | string>('')
  const [updateUser] = useUpdateUserMutation()

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
      <div>
        <MainHeadline>Profile</MainHeadline>
        <Spacing top />
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
    </>
  )
}

export default ProfilePage
