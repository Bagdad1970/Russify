const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

const readEnv = (key: keyof ImportMetaEnv): string => {
    const value = import.meta.env[key];

    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value;
};

const normalizeApiBaseUrl = (value: string): string =>
    trimTrailingSlash(value).replace(/\/api$/i, '');

export const appEnv = {
    apiBaseUrl: normalizeApiBaseUrl(readEnv('VITE_API_BASE_URL')),
    mediaBaseUrl: trimTrailingSlash(readEnv('VITE_MEDIA_BASE_URL')),
};
