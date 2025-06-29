import { connectTodb } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    try {
        const connect = await connectTodb();
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

        if (!videos || videos.length === 0) {
            return NextResponse.json(
                [],
                { status: 200 }
            )
        }

        return NextResponse.json(
            { videos },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: "error while getting videos." },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = getServerSession()
        if (!session) {
            NextResponse.json(
                { error: "unauthorise" },
                { status: 401 }
            )
        }
        const connect = await connectTodb();
        const video: IVideo = await request.json();
        console.log("video" , video);
        
        if (!video.description || !video.title || !video.thumbnailUrl ||!video.videoUrl) {
            return NextResponse.json(
                { error: " all fields required" }
            )
        }
        const videoData = {
            ...video,
            controls: video?.controles ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: video.transformation?.quality ?? 100,
            },
        }
        console.log(videoData);
        
        
        const newVideo = await Video.create(videoData);
        return NextResponse.json(
            { newVideo },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: "Error while uploading the video" },
            { status: 500 }
        )
    }


}