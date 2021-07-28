import { EmployeeTable } from 'features/tools/employees/EmployeeTable'
import { CardsWrapper } from 'hedvig-ui/card'
import { MainHeadline } from 'hedvig-ui/typography'
import React from 'react'

export const EmployeesComponent: React.FC = () => {
  return (
    <>
      <MainHeadline>Employees</MainHeadline>
      <CardsWrapper>
        <EmployeeTable />
      </CardsWrapper>
    </>
  )
}
