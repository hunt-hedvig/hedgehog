import styled from '@emotion/styled'
import { Button, ButtonsGroup, SearchableDropdown } from '@hedvig-ui'
import {
  EmployeesDocument,
  useAvailableEmployeeRolesQuery,
  useCreateEmployeeMutation,
} from 'api/generated/graphql'
import { Row } from 'features/tools/employees'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Input } from 'semantic-ui-react'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: fit-content;
  align-items: center;
`

const StyledDropdown = styled(SearchableDropdown)`
  width: 13em;
  padding: 0 1em;
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
        variation={'primary'}
        onClick={() => setCreatePressed(true)}
      >
        Create employee
      </Button>
    )
  }

  return (
    <Wrapper>
      <Row style={{ justifyContent: 'flex-start' }}>
        <Input
          value={email}
          placeholder={'Email'}
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
          placeholder={'Select role'}
        />
      </Row>
      <ButtonsGroup>
        <Button
          variation={'primary'}
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
        <Button onClick={() => setCreatePressed(false)}>Cancel</Button>
      </ButtonsGroup>
    </Wrapper>
  )
}
