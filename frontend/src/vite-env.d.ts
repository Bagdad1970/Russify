/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_MEDIA_BASE_URL: string;
    readonly VITE_DEV_PROXY_TARGET?: string;
    readonly VITE_ALLOWED_HOSTS?: string;
    readonly VITE_PORT?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
