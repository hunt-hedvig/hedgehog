import styled from '@emotion/styled'
import React, { useEffect } from 'react'
import { MemberTabs } from 'portals/hope/features/member'
import {
  formatLocale,
  useTemplateMessages,
} from 'portals/hope/features/template-messages/use-template-messages'
import { PickedLocale } from 'portals/hope/features/config/constants'
import gql from 'graphql-tag'
import { useMemberPickedLocaleQuery } from 'types/generated/graphql'

const Wrapper = styled.div`
  padding: 2rem 3rem 10rem;
`

gql`
  query MemberPickedLocale($memberId: ID!) {
    member(id: $memberId) {
      memberId
      pickedLocale
    }
  }
`

export const useMemberPickedLocale = (memberId: string) => {
  const { data } = useMemberPickedLocaleQuery({
    variables: { memberId },
    fetchPolicy: 'cache-first',
    skip: !memberId,
  })

  return data?.member?.pickedLocale ?? null
}

export const MemberContainer: React.FC<{
  memberId: string
  tab: string
  onChangeTab: (newTab: string) => void
  onClickClaim: (claimId: string) => void
  title?: string
}> = ({ memberId, tab, onChangeTab, onClickClaim, title }) => {
  const { setLocale, setMemberId, changeLocaleDisplayed } =
    useTemplateMessages()

  const pickedLocale = useMemberPickedLocale(memberId ?? '')

  useEffect(() => {
    setMemberId(memberId)

    if (
      pickedLocale &&
      formatLocale(pickedLocale as PickedLocale, true) ===
        formatLocale(PickedLocale.EnSe, true)
    ) {
      changeLocaleDisplayed(memberId, true)
    }

    setLocale((pickedLocale || PickedLocale.SvSe) as PickedLocale)
  }, [memberId, pickedLocale])

  return (
    <Wrapper>
      <MemberTabs
        memberId={memberId}
        tab={tab}
        onChangeTab={onChangeTab}
        onClickClaim={onClickClaim}
        chat={false}
        title={title}
      />
    </Wrapper>
  )
}
