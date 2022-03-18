import React, { useEffect } from 'react'
import { v4 as uuidV4 } from 'uuid'

/**
 *  A component that generates a unique ID for the current window and registers itself as
 *  the lead window to be responsible for renewing the access token. This guarantees that
 *  at most one window will attempt to refresh when it expires.
 *
 *  It is to be mounted top-level and, most importantly, outside ApolloProvider which
 *  instantiates the Apollo client.
 *
 *  How it works:
 *      1. If it is the first mount of the window, register a unique id in session storage.
 *         The scope of Session Storage is per window, so this won't be shared.
 *      2. Register the same ID in local storage to assign this window as "lead"
 *         If another window is opened, it will repeat the process but assign itself as "lead"
 *      3. When the Access Token expires, the window will first check whether it's the lead window.
 *         If it is, it will renew the access token. If not, it won't do anything.
 *
 */

const LOCAL_STORAGE_KEY = '_window_lead_id'
const SESSION_STORAGE_KEY = '_window_id'

export const RenewTokenLock: React.FC = () => {
  useEffect(() => {
    const id = sessionStorage.getItem(SESSION_STORAGE_KEY)

    if (!id) {
      const newId = uuidV4()

      sessionStorage.setItem(SESSION_STORAGE_KEY, newId)
      localStorage.setItem(LOCAL_STORAGE_KEY, newId)
    }
  }, [])

  return null
}

export const canRenewToken = () => {
  const windowId = sessionStorage.getItem(SESSION_STORAGE_KEY)
  const leadWindowId = localStorage.getItem(LOCAL_STORAGE_KEY)

  if (!windowId || !leadWindowId) {
    return false
  }

  return windowId === leadWindowId
}
