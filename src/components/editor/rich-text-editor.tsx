'use client'

import { useCallback, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import { ImageUpload } from './image-upload'
import { Link as LinkIcon } from 'lucide-react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

const imageDimensions = {
  small: { width: 320, height: 240 },
  medium: { width: 640, height: 480 },
  large: { width: 1024, height: 768 }
} as const

export function RichTextEditor({ content, onChange, placeholder = 'Write something...' }: RichTextEditorProps) {
  const [imageSize, setImageSize] = useState<keyof typeof imageDimensions>("medium")

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'my-4',
          },
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg mx-auto',
        },
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-4 py-2',
      },
    },
  })

  const addImage = useCallback(async (url: string) => {
    if (!editor) return

    try {
      const dimensions = imageDimensions[imageSize]
      
      // Add a new paragraph before the image if we're not at the start of a line
      if (!editor.isActive('paragraph')) {
        editor.chain().focus().setParagraph().run()
      }
      
      // Insert the image
      editor.chain()
        .focus()
        .setImage({ 
          src: url,
          alt: 'Blog image',
          title: `${dimensions.width}x${dimensions.height}`
        })
        .run()

      // Add custom styles after image is inserted
      const imgs = editor.view.dom.getElementsByTagName('img')
      const lastImg = imgs[imgs.length - 1]
      if (lastImg) {
        lastImg.style.width = `${dimensions.width}px`
        lastImg.style.maxWidth = '100%'
        lastImg.style.height = 'auto'
      }

      // Add a new paragraph after the image
      editor.chain().focus().setParagraph().run()
      
      console.log('Image inserted:', {
        url,
        dimensions,
        editorContent: editor.getHTML()
      })
    } catch (error) {
      console.error('Error inserting image:', error)
    }
  }, [editor, imageSize])

  if (!editor) {
    return null
  }

  const handleButtonClick = (callback: () => void) => (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    callback()
  }

  return (
    <div className="border rounded-md">
      <div className="border-b px-4 py-2 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleButtonClick(() => editor.chain().focus().toggleBold().run())}
          className={editor.isActive('bold') ? 'bg-accent' : ''}
        >
          <strong>B</strong>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleButtonClick(() => editor.chain().focus().toggleItalic().run())}
          className={editor.isActive('italic') ? 'bg-accent' : ''}
        >
          <em>I</em>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleButtonClick(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
        >
          H2
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleButtonClick(() => editor.chain().focus().toggleBulletList().run())}
          className={editor.isActive('bulletList') ? 'bg-accent' : ''}
        >
          •
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleButtonClick(() => editor.chain().focus().toggleOrderedList().run())}
          className={editor.isActive('orderedList') ? 'bg-accent' : ''}
        >
          1.
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleButtonClick(() => editor.chain().focus().setHorizontalRule().run())}
        >
          ―
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleButtonClick(() => {
            const url = window.prompt('Enter link URL')
            if (url) {
              editor.commands.setLink({ href: url })
            }
          })}
          className={editor.isActive('link') ? 'bg-accent' : ''}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <select
            value={imageSize}
            onChange={(e) => setImageSize(e.target.value as keyof typeof imageDimensions)}
            className="h-8 rounded border border-input bg-transparent px-2 text-sm"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>

          <ImageUpload onUpload={addImage}>
            <Button type="button" variant="ghost" size="sm">
              🖼️
            </Button>
          </ImageUpload>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
} 