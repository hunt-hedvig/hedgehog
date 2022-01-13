import React, { createContext, useContext, useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { usePageVisibility } from 'react-page-visibility'

interface UserTrackingData {
  location?: string
}

interface TrackingContextProps {
  update: (data: UserTrackingData) => void
  flush: () => void
  data: UserTrackingData | null
}

const TrackingContext = createContext<TrackingContextProps>({
  update: () => void 0,
  flush: () => void 0,
  data: null,
})

export const useTracking = () => useContext(TrackingContext)

export const TrackingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const TRACKING_COOKIE_NAME = '_hvg_payload'

  const isPageVisible = usePageVisibility()
  const [, setCookie] = useCookies([TRACKING_COOKIE_NAME])
  const [trackingData, setTrackingData] = useState<UserTrackingData | null>(
    null,
  )

  useEffect(() => {
    if (!trackingData || !isPageVisible) {
      return
    }

    setCookie(TRACKING_COOKIE_NAME, JSON.stringify(trackingData), { path: '/' })
  }, [trackingData, isPageVisible])

  const update = (data: UserTrackingData) => {
    setTrackingData(data)
  }

  const flush = () => {
    setTrackingData(null)
    setCookie(TRACKING_COOKIE_NAME, null, { path: '/' })
  }

  return (
    <TrackingContext.Provider value={{ data: trackingData, update, flush }}>
      {children}
    </TrackingContext.Provider>
  )
}
