import styled from '@emotion/styled'
import { Card, CardsWrapper, MainHeadline } from '@hedvig-ui'
import { EmployeeFilter } from 'features/tools/employees/components/EmployeeFilter'
import { EmployeeTable } from 'features/tools/employees/components/EmployeeTable'
import React, { useState } from 'react'
import { useGetMeQuery } from 'types/generated/graphql'

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const EmployeesPage: React.FC = () => {
  const { data } = useGetMeQuery()
  const scopes = data?.me?.scopes ?? []

  const [filter, setFilter] = useState({
    email: '',
    role: '',
    label: '',
  })

  return (
    <>
      <Row>
        <MainHeadline>Employees</MainHeadline>
      </Row>
      <CardsWrapper>
        <Card>
          <EmployeeFilter
            scopes={scopes}
            filter={filter}
            setFilter={setFilter}
          />
        </Card>
        <EmployeeTable scopes={scopes} filter={filter} />
      </CardsWrapper>
    </>
  )
}
