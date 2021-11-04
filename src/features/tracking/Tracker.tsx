import { useTracking } from 'features/tracking/hooks/use-tracking'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router'

export const Tracker: React.FC = () => {
  const tracking = useTracking()

  const location = useLocation()

  useEffect(() => {
    tracking.update({ ...tracking.data, location: location.pathname })
  }, [location])

  return null
}
