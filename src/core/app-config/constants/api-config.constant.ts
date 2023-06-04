const DATA_BASE = {
  DATA_BASE_URL: 'DATA_BASE_URL',
} as const;

// JWT
const JWT = {
  JWT_ACCESS_KEY: 'JWT_ACCESS_KEY',
} as const;

export const ENV_KEY = {
  PORT: 'PORT',
  NODE_ENV: 'NODE_ENV',
  ...JWT,
  ...DATA_BASE,
} as const;
