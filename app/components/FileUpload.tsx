"use client";

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { set } from "mongoose";
import { useRef, useState } from "react";

interface FileUploadProps {
    onSuccess?: (response: any) => void;
    onProgress?: (progress: number) => void;
    fileTypes?: "image" | "video";
}

const FileUpload = ({
    onSuccess,
    onProgress,
    fileTypes,
}: FileUploadProps) => {

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const validateFileType = (file: File) => {
        if (fileTypes === 'image' && !file.type.startsWith('image/')) {
            setError("Please upload a valid image file.");
            return false;
        }
        if (fileTypes === 'video' && !file.type.startsWith('video/')) {
            setError("Please upload a valid video file.");
            return false;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError("File size exceeds 10MB limit.");
            return false;
        }

        return true
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0];
        if (!file || !validateFileType(file)) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const authres = await fetch('/api/auth/imagekit-auth');
            if (!authres.ok) {
                throw new Error("Failed to fetch authentication data");
            }
            const authData = await authres.json();
            console.log("auth" , authData);
            
            const res = await upload({
                file,
                fileName: file.name,
                publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
                signature: authData.authPara.signature,
                expire: authData.authPara.expire,
                token: authData.authPara.token,
                onProgress: (event) => {
                    if (event.lengthComputable && onProgress) {
                        const percent = (event.loaded / event.total) * 100;
                        onProgress(Math.round(percent))
                    }
                },

            });
            console.log("data res:" , res);
            
            onSuccess?.(res);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError("An error occurred while uploading the file.");
        }
    }
    return (
        <>
            <input
                type="file"
                accept={fileTypes === "video" ? "video/*" : "image/*"}
                onChange={handleFileChange}
            />
        </>
    )
}

export default FileUpload
