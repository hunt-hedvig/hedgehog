import React, { createContext, useContext, useState } from 'react'
import { UserTrackingData } from 'types/generated/graphql'

interface TrackingContextProps {
  update: (current: UserTrackingData) => void
  flush: () => void
  data: UserTrackingData | null
}

const TrackingContext = createContext<TrackingContextProps>({
  update: (_: UserTrackingData) => void 0,
  flush: () => void 0,
  data: null,
})

export const useTracking = () => useContext(TrackingContext)

export const TrackingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [trackingData, setTrackingData] = useState<UserTrackingData | null>(
    null,
  )

  const update = (data: UserTrackingData) => {
    setTrackingData(data)
  }

  const flush = () => setTrackingData(null)

  return (
    <TrackingContext.Provider value={{ data: trackingData, update, flush }}>
      {children}
    </TrackingContext.Provider>
  )
}
