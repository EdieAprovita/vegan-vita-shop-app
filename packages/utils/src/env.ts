export const getEnvVar = (name: string, defaultValue?: string): string => {
  const value = process.env[name];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value || defaultValue || '';
};

export const getEnvVarAsNumber = (name: string, defaultValue?: number): number => {
  const value = getEnvVar(name, defaultValue?.toString());
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid number`);
  }
  return parsed;
};

export const getEnvVarAsBoolean = (name: string, defaultValue = false): boolean => {
  const value = getEnvVar(name, defaultValue.toString());
  return value.toLowerCase() === 'true';
};

export const isDevelopment = (): boolean => {
  return getEnvVar('NODE_ENV', 'development') === 'development';
};

export const isProduction = (): boolean => {
  return getEnvVar('NODE_ENV', 'development') === 'production';
};

export const isTest = (): boolean => {
  return getEnvVar('NODE_ENV', 'development') === 'test';
};