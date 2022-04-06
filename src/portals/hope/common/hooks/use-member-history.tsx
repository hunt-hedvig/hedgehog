import React, { createContext, useContext, useEffect, useState } from 'react'

const MEMBER_HISTORY_KEY = 'hedvig:members:history'

export const getDefaultHistory = (): ReadonlyArray<string> => {
  try {
    return (
      JSON.parse(window.sessionStorage.getItem(MEMBER_HISTORY_KEY) ?? '') ?? []
    )
  } catch {
    return []
  }
}

interface MemberHistoryContextProps {
  memberHistory: ReadonlyArray<string>
  pushToMemberHistory: (memberId: string) => void
}

export const MemberHistoryContext = createContext<MemberHistoryContextProps>({
  memberHistory: getDefaultHistory(),
  pushToMemberHistory: () => void 0,
})

export const useMemberHistory = () => useContext(MemberHistoryContext)

export const MemberHistoryProvider: React.FC = ({ children }) => {
  const [memberHistory, setMemberHistory] = useState(() => getDefaultHistory())

  useEffect(() => {
    if (!memberHistory?.length) {
      return
    }

    sessionStorage.setItem(MEMBER_HISTORY_KEY, JSON.stringify(memberHistory))
  }, [memberHistory?.length])

  return (
    <MemberHistoryContext.Provider
      value={{
        memberHistory,
        pushToMemberHistory: (memberId: string) => {
          setMemberHistory(
            Array.from(new Set([memberId, ...memberHistory])).slice(0, 6),
          )
        },
      }}
    >
      {children}
    </MemberHistoryContext.Provider>
  )
}
