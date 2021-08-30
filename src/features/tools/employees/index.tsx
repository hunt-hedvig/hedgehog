import styled from '@emotion/styled'
import { EmployeeFilter } from 'features/tools/employees/components/EmployeeFilter'
import { EmployeeTable } from 'features/tools/employees/components/EmployeeTable'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { MainHeadline } from 'hedvig-ui/typography'
import React, { useState } from 'react'
import { useScopes } from 'utils/auth'

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const Employees: React.FC = () => {
  const scopes = useScopes()
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
