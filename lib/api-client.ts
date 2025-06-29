import { IVideo } from "@/models/Video";

export type VideoFormData = Omit<IVideo, "_id">;

type Ioption = {
    method?: "GET" | "POST" | "PUT" | "DELETE",
    body?: any,
    headers?: Record<string, string>
}

class apiClient {
    private async fetch<T>(
        endpointUrl: string,
        options: Ioption = {}
    ): Promise<T> {
        const {method="GET" , headers = {}, body} = options;

        const defualtHeaders = {
           'Content-Type': 'application/json',
            ...headers
        }
        const res = await fetch(`/api${endpointUrl}`,{
            method,
            body:body ? JSON.stringify(body): undefined,
            headers:defualtHeaders
        })

        if(!res.ok){
            throw new Error(await res.text());
        }

        return res.json();
    }


    async getVideos(){
        return this.fetch("/video")
    }

    async uploadVideo(videoData:VideoFormData){
        return this.fetch("/video",{
            method:"POST",
            body:videoData,
        })
    }
}

export const ApiClient = new apiClient();