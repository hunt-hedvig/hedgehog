const defaultGatekeeperHost =
  process.env.NODE_ENV === 'production' ? null : 'https://id.dev.hedvigit.com'

const requireNotNullish = <T>(
  thing: T | null | undefined,
  description: string,
): T => {
  if (thing === null || thing === undefined) {
    throw Error(
      `Expected ${description} to not be nullish but was ${typeof thing}`,
    )
  }

  return thing!
}

export const config = {
  oauthClientId: requireNotNullish(
    process.env.OAUTH_CLIENT_ID,
    'oauth client id',
  ),
  oauthClientSecret: requireNotNullish(
    process.env.OAUTH_CLIENT_SECRET,
    'oauth client secret',
  ),
  gatekeeperHost: requireNotNullish(defaultGatekeeperHost, 'gatekeeper host'),
}
