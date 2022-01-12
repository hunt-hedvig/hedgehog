import styled from '@emotion/styled'
import { RadioGroup } from '@hedvig-ui'
import { range } from '@hedvig-ui/utils/range'
import { MemberGroups } from 'portals/hope/features/config/constants'
import { useMe } from 'portals/hope/features/user/hooks/use-me'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import React from 'react'
import { UserSettingKey } from 'types/generated/graphql'

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

interface MemberGroupsProps {
  groupsNumber?: number
  setGroupsNumber?: (value: number) => void
  additionalSettingUpdate?: (value: number) => void
}

export const NumberMemberGroupsRadioButtons: React.FC<MemberGroupsProps> = ({
  groupsNumber,
  setGroupsNumber,
  additionalSettingUpdate,
}) => {
  const { updateSetting } = useMe()
  const { numberMemberGroups, setNumberMemberGroups } = useNumberMemberGroups()

  return (
    <Group>
      <RadioGroup
        value={groupsNumber || numberMemberGroups}
        onChange={(e) => {
          if (!setGroupsNumber) {
            if (additionalSettingUpdate) {
              additionalSettingUpdate(e as number)
            }
            setNumberMemberGroups(e as number)
            updateSetting(UserSettingKey.NumberOfMemberGroups, {
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
