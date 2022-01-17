import { SOSHotApp } from 'portals/sos/App'
import { HOPEHotApp } from 'portals/hope/App'

export const app = (portal: string) => {
  switch (portal.toUpperCase()) {
    case 'SOS':
      return SOSHotApp
    case 'HOPE':
      return HOPEHotApp
  }
}
