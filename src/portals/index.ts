import { SOSHotApp } from 'portals/sos/App'
import { HOPEHotApp } from 'portals/hope/App'

type Portal = 'SOS' | 'Hope'

export const app = (portal: Portal) => {
  switch (portal) {
    case 'SOS':
      return SOSHotApp
    case 'Hope':
      return HOPEHotApp
  }
}
