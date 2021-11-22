import styled from '@emotion/styled'
import { RadioGroup } from '@hedvig-ui'
import { range } from '@hedvig-ui/utils/range'
import { MemberGroups } from 'features/config/constants'
import { useMe } from 'features/user/hooks/use-me'
import { useNumberMemberGroups } from 'features/user/hooks/use-number-member-groups'
import React from 'react'
import { UserSettingKey } from 'types/generated/graphql'

const Group = styled.div`
  display: flex;
  align-items: center;

  & > div:not(:last-child) {
    margin-right: 28px;
  }
`

const numberMemberGroupsOptions = range(
  Object.keys(MemberGroups).length - 1,
).map((numberMemberGroups) => {
  return {
    value: numberMemberGroups + 2,
    label: (numberMemberGroups + 2).toString(),
  }
})

export const NumberMemberGroupsRadioButtons: React.FC = () => {
  const { updateSetting } = useMe()
  const { numberMemberGroups, setNumberMemberGroups } = useNumberMemberGroups()

  return (
    <Group>
      <RadioGroup
        value={numberMemberGroups}
        onChange={(e: number) => {
          setNumberMemberGroups(e)
          updateSetting(UserSettingKey.NumberOfMemberGroups, { value: e })
        }}
        options={numberMemberGroupsOptions}
      />
    </Group>
  )
}
