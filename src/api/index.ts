import axios from 'axios'

const setItemWithExpiry = (key, value, ttl) =>
  localStorage.setItem(
    key,
    JSON.stringify({
      value,
      expiry: new Date().getTime() + ttl,
    }),
  )

const getItemWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key)

  if (!itemStr) {
    return null
  }

  const item = JSON.parse(itemStr)

  if (new Date().getTime() > item.expiry) {
    localStorage.removeItem(key)
    return null
  }

  return item.value
}

export const refreshAccessToken = async () => {
  if (getItemWithExpiry('hvg:refreshingAccessToken') === 'true') {
    // bail if we're already refreshing
    return
  }

  try {
    setItemWithExpiry('hvg:refreshingAccessToken', 'true', 10000)
    await axios.post('/login/refresh', null, {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      withCredentials: true,
    })
  } finally {
    localStorage.removeItem('hvg:refreshingAccessToken')
  }
}
