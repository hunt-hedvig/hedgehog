import styled from '@emotion/styled'
import {
  ListEmployeesDocument,
  useCreateEmployeeMutation,
} from 'api/generated/graphql'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { Spacing } from 'hedvig-ui/spacing'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Input } from 'semantic-ui-react'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: fit-content;
  align-items: center;
`

export const CreateEmployee: React.FC = () => {
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
            disabled={loading || !email.endsWith('@hedvig.com')}
            onClick={() => {
              toast.promise(createEmployee({ variables: { email } }), {
                loading: 'Creating employee',
                success: () => {
                  reset()
                  return 'Employee created'
                },
                error: 'Could not create employee',
              })
            }}
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
