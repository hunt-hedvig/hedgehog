import styled from '@emotion/styled'
import { RadioGroup } from '@hedvig-ui'
import { range } from '@hedvig-ui/utils/range'
import { MemberGroups } from 'portals/hope/features/config/constants'
import { useMe } from 'portals/hope/features/user/hooks/use-me'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import React from 'react'

const Group = styled.div`
  display: flex;
  align-items: center;

  & > div:not(:last-child) {
    margin-right: 28px;
  }
`

export const numberMemberGroupsOptions = range(
  Object.keys(MemberGroups).length - 1,
).map((numberMemberGroups) => {
  return {
    value: numberMemberGroups + 2,
    label: (numberMemberGroups + 2).toString(),
  }
})

interface MemberGroupsProps extends React.HTMLAttributes<HTMLDivElement> {
  groupsNumber?: number
  setGroupsNumber?: (value: number) => void
  additionalSettingUpdate?: (value: number) => void
}

export const NumberMemberGroupsRadioButtons: React.FC<MemberGroupsProps> = ({
  groupsNumber,
  setGroupsNumber,
  additionalSettingUpdate,
  ...props
}) => {
  const { updateSetting } = useMe()
  const { numberMemberGroups, setNumberMemberGroups } = useNumberMemberGroups()

  return (
    <Group {...props}>
      <RadioGroup
        value={groupsNumber || numberMemberGroups}
        onChange={(e) => {
          if (!setGroupsNumber) {
            if (additionalSettingUpdate) {
              additionalSettingUpdate(e as number)
            }
            setNumberMemberGroups(e as number)
            updateSetting('numberOfMemberGroups', {
              value: e as number,
            })
          } else {
            setGroupsNumber(e as number)
          }
        }}
        options={numberMemberGroupsOptions}
      />
    </Group>
  )
}
