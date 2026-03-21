import { appEnv } from '../config/env.ts';

export class FileManager {
    private readonly baseUrl: string;

    constructor() {
        this.baseUrl = appEnv.mediaBaseUrl;
    }

    getFileUrl(bucket: 'music' | 'images', hash: string): string {
        return `${this.baseUrl}/${bucket}/${hash}`;
    }
}
