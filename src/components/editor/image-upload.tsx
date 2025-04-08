'use client'

import { useRef } from "react"
import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

interface ImageUploadProps {
  onUpload: (url: string) => void
  children?: React.ReactNode
}

export function ImageUpload({ onUpload, children }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const storageRef = ref(storage, `blog/${Date.now()}-${file.name}`)
      const snapshot = await uploadBytes(storageRef, file)
      const url = await getDownloadURL(snapshot.ref)
      onUpload(url)
    } catch (error) {
      console.error("Error uploading image:", error)
    }
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div onClick={() => fileInputRef.current?.click()}>
        {children || (
          <button
            type="button"
            className="p-2 rounded hover:bg-accent"
            title="Add Image"
          >
            🖼️
          </button>
        )}
      </div>
    </>
  )
} 