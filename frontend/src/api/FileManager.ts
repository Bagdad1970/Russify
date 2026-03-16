import api from "./ApiClient.ts";
import type {FileGetRequest} from "../types/request/FileGetRequest.ts";

export class FileManager {

    async getFileUrl(request: FileGetRequest): Promise<string> {
        try {
            const response = await api.get("files", {
                params: {
                    bucket: request.bucket,
                    hash: request.hash
                },
                responseType: "blob"
            });

            return URL.createObjectURL(response.data);
        }
        catch (error) {
            console.error("Error fetching file:", error);
            throw error;
        }
    }

    revokeFileUrl(url: string): void {
        URL.revokeObjectURL(url);
    }

}