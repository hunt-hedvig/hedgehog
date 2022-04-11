import dotenv from 'dotenv'

dotenv.config()

const requireNotNullish = <T>(
  thing: T | null | undefined,
  description: string,
): T => {
  if (thing === null || thing === undefined) {
    throw Error(
      `Expected ${description} to not be nullish but was ${typeof thing}`,
    )
  }

  return thing
}

const gatekeeperHost = requireNotNullish(
  process.env.GATEKEEPER_HOST ??
    (process.env.NODE_ENV === 'production'
      ? null
      : 'https://id.dev.hedvigit.com'),
  'gatekeeper host',
)
const authServiceHost = requireNotNullish(
  process.env.AUTH_HOST ??
    (process.env.NODE_ENV === 'production'
      ? null
      : 'https://auth.dev.hedvigit.com'),
  'auth service host',
)

export const config = {
  hedvigOnboardingUrl: requireNotNullish(
    process.env.HEDVIG_ONBOARDING_URL,
    'hedvig onboarding url',
  ),
  oauthClientId: requireNotNullish(
    process.env.OAUTH_CLIENT_ID,
    'oauth client id',
  ),
  oauthClientSecret: requireNotNullish(
    process.env.OAUTH_CLIENT_SECRET,
    'oauth client secret',
  ),
  gatekeeperHost,
  authServiceHost,
  loginUrl: `${authServiceHost}/login`
  stagingSpecificTools: process.env.USE_STAGING_SPECIFIC_TOOLS === 'true',
  useHelmet: process.env.USE_HELMET === 'true',
  useSecureCookies: process.env.USE_SECURE_COOKIES === 'true',
  swishPayoutsEnabled: process.env.SWISH_PAYOUTS_ENABLED === 'true',
}
