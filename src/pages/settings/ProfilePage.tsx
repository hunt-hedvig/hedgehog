import styled from '@emotion/styled'
import {
  Button,
  Flex,
  Input,
  Label,
  MainHeadline,
  SecondLevelHeadline,
  Spacing,
} from '@hedvig-ui'
import { useDarkmode } from '@hedvig-ui/hooks/use-darkmode'
import React, { useEffect, useState } from 'react'
import { Moon, Sun } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import { useGetMeQuery, useUpdateUserMutation } from 'types/generated/graphql'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2rem;
`

const ProfilePage: React.FC = () => {
  const { data } = useGetMeQuery()
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState<null | string>('')
  const [updateUser] = useUpdateUserMutation()
  const { isDarkmode, setIsDarkmode } = useDarkmode()

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

  const changes =
    fullName !== data?.me.user.fullName ||
    phoneNumber !== data.me.user.phoneNumber

  if (!data) {
    return null
  }

  return (
    <Wrapper>
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
      <div>
        <SecondLevelHeadline>Dark mode:</SecondLevelHeadline>
        <Button
          variant="secondary"
          onClick={() => setIsDarkmode(!isDarkmode)}
          icon={isDarkmode ? <Sun /> : <Moon />}
        >
          <span style={{ marginLeft: '0.8rem' }}>
            Set {isDarkmode ? 'Dark' : 'Light'} mode
          </span>
        </Button>
      </div>
    </Wrapper>
  )
}

export default ProfilePage
