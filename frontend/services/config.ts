// TODO: The public env vars dont work with this function
const getEnvironmentVariable = (
  environmentVariable: string,
  required?: boolean
): string | undefined => {
  const unvalidatedEnvironmentVariable = process.env[environmentVariable];

  if (!unvalidatedEnvironmentVariable && required) {
    throw new Error(
      `Couldn't find environment variable: ${environmentVariable}`
    );
  }

  return unvalidatedEnvironmentVariable;
};

export const NEXTAUTH_URL = getEnvironmentVariable('NEXTAUTH_URL');
export const NEXTAUTH_SECRET = getEnvironmentVariable('NEXTAUTH_SECRET');
export const OPENAI_API_BASE = getEnvironmentVariable('OPENAI_API_BASE');
export const OPENAI_API_KEY = getEnvironmentVariable('OPENAI_API_KEY');
export const GPT_ENGINE = getEnvironmentVariable('GPT_ENGINE');
export const PUBLIC_NEXTAUTH_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;
export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
export const PUBLIC_DEFAULT_LOGIN_PROVIDER =
  process.env.NEXT_PUBLIC_DEFAULT_LOGIN_PROVIDER;

export const AUTH_KEYCLOAK_ID = getEnvironmentVariable('AUTH_KEYCLOAK_ID');

export const AUTH_KEYCLOAK_SECRET = getEnvironmentVariable(
  'AUTH_KEYCLOAK_SECRET'
);

export const AUTH_KEYCLOAK_ISSUER = getEnvironmentVariable(
  'AUTH_KEYCLOAK_ISSUER'
);

export const PUBLIC_NFTY_HTTP_SSL =
  getEnvironmentVariable('NFTY_HTTP_SSL') === 'true';
export const NFTY_WS_SSL =
  (getEnvironmentVariable('NFTY_WS_SSL') ?? 'false') === 'true';
export const NFTY_WS_HOST =
  getEnvironmentVariable('NFTY_WS_HOST') ?? 'localhost:8093';

export const GITHUB_CLIENT_ID = getEnvironmentVariable('GITHUB_CLIENT_ID');
export const GITHUB_CLIENT_SECRET = getEnvironmentVariable(
  'GITHUB_CLIENT_SECRET'
);

// TODO: These might be required
export const PUBLIC_KEYCLOAK_CLIENT_ID =
  process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
export const PUBLIC_KEYCLOAK_URL = process.env.NEXT_PUBLIC_KEYCLOAK_URL;

export const PUBLIC_KEYCLOAK_REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
