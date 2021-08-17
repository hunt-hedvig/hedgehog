import styled from '@emotion/styled'
import {
  EmployeesDocument,
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

export const CreateEmployee: React.FC<{ scopes: readonly string[] }> = ({
  scopes,
}) => {
  const [createPressed, setCreatePressed] = useState(false)
  const [email, setEmail] = useState('')

  const [createEmployee, { loading }] = useCreateEmployeeMutation({
    refetchQueries: () => [{ query: EmployeesDocument }],
  })

  const reset = () => {
    setCreatePressed(false)
    setEmail('')
  }

  if (!createPressed) {
    return (
      <Button
        disabled={!scopes.includes('employees:manage')}
        variation={'primary'}
        onClick={() => setCreatePressed(true)}
      >
        Create employee
      </Button>
    )
  }

  return (
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
  )
}
