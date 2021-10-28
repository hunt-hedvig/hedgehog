import styled from '@emotion/styled'
import { FilterStateType, getFilterColor } from 'features/questions/filter'

export const MemberGroupColorBadge = styled.div<{ filter?: FilterStateType }>`
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  border-radius: 2px;
  vertical-align: center;
  margin-left: 0.5rem;
  background-color: ${({ filter }) =>
    filter !== undefined ? getFilterColor(filter) : '#fff'};
`
