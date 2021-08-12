import { CreateEmployee } from 'features/tools/employees/components/CreateEmployee'
import { EmployeeFilter } from 'features/tools/employees/components/EmployeeFilter'
import { EmployeeTable } from 'features/tools/employees/components/EmployeeTable'
import { Row } from 'features/tools/employees/utils'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { MainHeadline } from 'hedvig-ui/typography'
import React, { useState } from 'react'

export const EmployeesComponent: React.FC = () => {
  const [filter, setFilter] = useState({
    email: '',
    role: null,
  })

  return (
    <>
      <Row>
        <MainHeadline>Employees</MainHeadline>
        <CreateEmployee />
      </Row>
      <CardsWrapper>
        <Card>
          <EmployeeFilter filter={filter} setFilter={setFilter} />
        </Card>
        <EmployeeTable filter={filter} />
      </CardsWrapper>
    </>
  )
}
