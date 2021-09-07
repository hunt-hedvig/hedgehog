import styled from '@emotion/styled'

export const Table = styled.table`
  margin-top: 2em;
  font-weight: normal;
  text-align: left;
  width: 100%;
  border-collapse: collapse;
`

export const TableColumn = styled.td`
  padding: 1.6em 1em;
  font-size: 1.05em;
  transition: all 100ms;
  :hover {
    cursor: pointer;
  }
`

export const TableHeader = styled.th`
  font-weight: lighter;
  color: ${({ theme }) => theme.semiStrongForeground};
  font-size: 0.8em;
  padding: 0.5em 1em 0.5em 1.2em;
  background-color: ${({ theme }) => theme.accentLight};

  :first-child {
    border-radius: 8px 0 0 0;
  }

  :last-child {
    border-radius: 0 8px 0 0;
  }
`

export const TableRow = styled.tr`
  width: 100%;
  transition: all 150ms;

  :hover {
    background-color: ${({ theme }) => theme.accentLight};
  }
  background-color: ${({ theme }) => theme.accentLighter};
`
