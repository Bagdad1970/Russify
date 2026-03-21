import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const parseCsv = (value?: string): string[] =>
    value
        ?.split(',')
        .map(item => item.trim())
        .filter(Boolean) ?? [];

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const proxyTarget = env.VITE_DEV_PROXY_TARGET;
    const allowedHosts = parseCsv(env.VITE_ALLOWED_HOSTS);
    const port = Number(env.VITE_PORT ?? '5173');

    return {
        plugins: [react()],
        server: {
            ...(proxyTarget ? {
                proxy: {
                    '/api': {
                        target: proxyTarget,
                        changeOrigin: true,
                        secure: false,
                    }
                }
            } : {}),
            ...(allowedHosts.length > 0 ? { allowedHosts } : {}),
            port,
            strictPort: true
        }
    };
});
