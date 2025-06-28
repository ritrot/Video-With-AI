import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {

    try {
        const authPara = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string,

        })

        return Response.json({ authPara, publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY })
    } catch (error) {
        return Response.json(
            { error: "Error while getting authPara" },
            { status: 500 }
        )
    }
}