import styled from '@emotion/styled'
import { MemberGroupColors } from 'features/config/constants'
import { FilterStateType } from 'features/questions/FilterSelect'

export const MemberGroupColorBadge = styled.div<{ filter?: FilterStateType }>`
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  border-radius: 2px;
  vertical-align: center;
  margin-left: 0.5rem;
  background-color: ${({ filter }) => {
    console.log(filter)
    return filter !== undefined ? MemberGroupColors[filter + 1] : '#fff'
  }};
`
