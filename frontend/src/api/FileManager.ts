export class FileManager {
    private readonly baseUrl: string;

    constructor() {
        this.baseUrl = 'http://localhost:9000';
    }

    async getFileUrl(bucket: 'music' | 'images', hash: string): Promise<string> {
        return `${this.baseUrl}/${bucket}/${hash}`;
    }
}