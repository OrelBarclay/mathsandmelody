'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { ImagePlus, Loader2 } from "lucide-react"

interface ImageUploadProps {
  onUpload: (url: string) => void
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)

      // Create a unique file name
      const fileName = `${Date.now()}-${file.name}`
      const storageRef = ref(storage, `blog/${fileName}`)

      // Upload the file
      const snapshot = await uploadBytes(storageRef, file)

      // Get the download URL
      const url = await getDownloadURL(snapshot.ref)

      // Call the onUpload callback with the URL
      onUpload(url)
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
        id="image-upload"
      />
      <Button
        variant="outline"
        size="sm"
        disabled={uploading}
        asChild
      >
        <label htmlFor="image-upload" className="cursor-pointer">
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <ImagePlus className="h-4 w-4 mr-2" />
              Add Image
            </>
          )}
        </label>
      </Button>
    </div>
  )
} 