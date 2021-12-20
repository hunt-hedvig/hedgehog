import styled from '@emotion/styled'
import { Button, ButtonsGroup, Input, SearchableDropdown } from '@hedvig-ui'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  EmployeesDocument,
  useAvailableEmployeeRolesQuery,
  useCreateEmployeeMutation,
} from 'types/generated/graphql'

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 40%;
  justify-content: flex-end;
  align-items: center;
`

export const StyledDropdown = styled(SearchableDropdown)`
  flex: 1;
  padding: 0 1em;
`

export const StyledInput = styled(Input)`
  padding-top: 12px;
  padding-bottom: 12px;
`

export const CreateEmployee: React.FC<{ scopes: readonly string[] }> = ({
  scopes,
}) => {
  const [createPressed, setCreatePressed] = useState(false)
  const [email, setEmail] = useState('')
  const [selectedRole, setSelectedRole] = useState({ role: '', label: '' })
  const { data } = useAvailableEmployeeRolesQuery()
  const roles = data?.availableEmployeeRoles ?? []
  const options =
    roles.map((value, index) => {
      return {
        key: index + 1,
        value,
        label: (value as string).replace('_', ' '),
      }
    }) ?? []

  const [createEmployee, { loading }] = useCreateEmployeeMutation({
    refetchQueries: () => [{ query: EmployeesDocument }],
  })

  const reset = () => {
    setCreatePressed(false)
    setEmail('')
    setSelectedRole({ role: '', label: '' })
  }

  if (!createPressed) {
    return (
      <Button
        disabled={!scopes.includes('employees:manage')}
        variant="primary"
        onClick={() => setCreatePressed(true)}
      >
        Create employee
      </Button>
    )
  }

  return (
    <Wrapper>
      <Row style={{ width: '100%' }}>
        <StyledInput
          style={{ flex: 1 }}
          value={email}
          placeholder="Email"
          disabled={loading}
          onChange={({ currentTarget: { value } }) => setEmail(value)}
        />
        <StyledDropdown
          options={options}
          value={
            selectedRole.role
              ? { value: selectedRole.role, label: selectedRole.label }
              : null
          }
          onChange={(val) => {
            setSelectedRole({ role: val?.value, label: val?.label })
          }}
          isSearchable={false}
          placeholder="Select role"
        />
      </Row>
      <ButtonsGroup style={{ width: 'fit-content' }}>
        <Button
          variant="primary"
          disabled={
            loading || !email.endsWith('@hedvig.com') || !selectedRole.role
          }
          onClick={() => {
            const role = selectedRole.role
            toast.promise(createEmployee({ variables: { email, role } }), {
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
        <Button variant="tertiary" onClick={() => setCreatePressed(false)}>
          Cancel
        </Button>
      </ButtonsGroup>
    </Wrapper>
  )
}
