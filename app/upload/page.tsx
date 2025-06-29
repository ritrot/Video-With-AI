'use client'

import React, { useState } from 'react'
import FileUpload from '../components/FileUpload'
import { ApiClient } from '@/lib/api-client'
const page = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    controles: false,
    transformation: {
      height: 1920,
      width: 1080,
      quality: 100,
    },
  });

  const [progress, setProgress] = useState(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    ApiClient.uploadVideo(formData)
      .then((response) => {
        console.log("Video uploaded successfully:", response);
      })
      .catch((error) => {
        console.error("Error uploading video:", error);
      });
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleInputChange} name='title' placeholder='title' />
        <input type="text" onChange={handleInputChange} name='description' placeholder='description' />
        <FileUpload
          onSuccess={(res) => {
            setFormData({
              ...formData,
              videoUrl: res.url,
              thumbnailUrl: res.thumbnailUrl,
              transformation: {
                height: res.height || 1920,
                width: res.width || 1080,
                quality: res.quality || 100,
              },
            })
          }}

          onProgress={(progress) => {
            setProgress(progress);
          }}
        />
        <button type="submit">{progress > 0 && progress < 100 ? `Uploading... ${progress}%` : 'Upload'}</button>
      </form>
    </div>
  )
}

export default page
