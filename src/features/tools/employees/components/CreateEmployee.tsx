import styled from '@emotion/styled'
import {
  ListEmployeesDocument,
  useCreateEmployeeMutation,
} from 'api/generated/graphql'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { Spacing } from 'hedvig-ui/spacing'
import React, { useState } from 'react'
import { Input } from 'semantic-ui-react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { withShowNotification } from 'utils/notifications'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: fit-content;
  align-items: center;
`

const Employee: React.FC<WithShowNotification> = ({ showNotification }) => {
  const [createPressed, setCreatePressed] = useState(false)
  const [email, setEmail] = useState('')

  const [createEmployee, { loading }] = useCreateEmployeeMutation({
    refetchQueries: () => [{ query: ListEmployeesDocument }],
  })

  const reset = () => {
    setCreatePressed(false)
    setEmail('')
  }

  return createPressed ? (
    <Wrapper>
      <Spacing right={'small'}>
        <Input
          value={email}
          placeholder={'Email'}
          disabled={loading}
          onChange={({ currentTarget: { value } }) => setEmail(value)}
        />
      </Spacing>
      <Spacing left={'small'}>
        <ButtonsGroup>
          <Button
            variation={'primary'}
            onClick={() =>
              createEmployee({ variables: { email } })
                .then(() => {
                  showNotification({
                    type: 'olive',
                    header: 'Employee created',
                    message: 'Successfully created employee.',
                  })
                  reset()
                })
                .catch((error) => {
                  showNotification({
                    type: 'red',
                    header: 'Unable to create employee.',
                    message: error.message,
                  })
                  throw error
                })
            }
          >
            Create
          </Button>
          <Button onClick={() => setCreatePressed(false)}>Cancel</Button>
        </ButtonsGroup>
      </Spacing>
    </Wrapper>
  ) : (
    <Button variation={'primary'} onClick={() => setCreatePressed(true)}>
      Create employee
    </Button>
  )
}

export const CreateEmployee = withShowNotification(Employee)
