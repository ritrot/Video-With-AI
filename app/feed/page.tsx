"use client"

import { ApiClient } from '@/lib/api-client'
import React, { useEffect, useState } from 'react'
import { IKImage, IKVideo } from "imagekitio-next";
import { IVideo } from '@/models/Video';
const page = () => {
    const [videos, setVideos] = useState<IVideo[]>([])
    useEffect(() => {
        ApiClient.getVideos()
            .then((res:any) => {
                setVideos(res.videos as IVideo[]);
            })
            .catch((error) => {
                console.error("Error fetching videos:", error);
            });
    }, []);
    return (
        <div className='w-1/2 flex flex-wrap gap-4 p-10'>{
            videos?.map((video , index) => (
                <div key={video._id?.toString()} >
                    <h1>{video.title}</h1>
                    <p>{video.description}</p>
                    <IKImage
                        urlEndpoint={video.videoUrl}
                        path={video.videoUrl}
                        src={video.videoUrl}
                        alt={video.title || "Video thumbnail"}
                        transformation={[{
                            width: video.transformation?.width,
                            height: video.transformation?.height
                        }]}
                    />
                </div>
            ))
        }
        </div>
    )
}

export default page
