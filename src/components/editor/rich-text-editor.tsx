'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import CodeBlock from '@tiptap/extension-code-block'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import { ImageUpload } from './image-upload'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
  Code,
  Heading1,
  Heading2,
  Link as LinkIcon,
} from 'lucide-react'
import { useCallback, useRef, useState } from "react"
import { Editor } from "@tiptap/react"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

interface EditorMenuBarProps {
  editor: Editor | null
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

    const dimensions = imageDimensions[imageSize]
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
  }, [editor, imageSize])

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-md">
      <div className="border-b px-4 py-2 flex flex-wrap items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-accent' : ''}
        >
          <strong>B</strong>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-accent' : ''}
        >
          <em>I</em>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
        >
          H2
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-accent' : ''}
        >
          •
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-accent' : ''}
        >
          1.
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          ―
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const url = window.prompt('Enter link URL')
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
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
            <Button variant="ghost" size="sm">
              🖼️
            </Button>
          </ImageUpload>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export function EditorMenuBar({ editor }: EditorMenuBarProps) {
  const [imageSize, setImageSize] = useState("medium")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addImage = useCallback(async (url: string) => {
    if (!editor) return

    const size = {
      small: { width: 320, height: 240 },
      medium: { width: 640, height: 480 },
      large: { width: 1024, height: 768 }
    }[imageSize]

    editor.chain()
      .focus()
      .setImage({ 
        src: url,
        width: size.width,
        height: size.height,
        alt: 'Blog image'
      })
      .run()
  }, [editor, imageSize])

  if (!editor) return null

  return (
    <div className="border border-input bg-transparent rounded-t-md px-3 py-2 flex flex-wrap gap-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-accent ${editor.isActive('bold') ? 'bg-accent' : ''}`}
        title="Bold"
      >
        <strong>B</strong>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-accent ${editor.isActive('italic') ? 'bg-accent' : ''}`}
        title="Italic"
      >
        <em>I</em>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-accent ${editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}`}
        title="Heading"
      >
        H2
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-accent ${editor.isActive('bulletList') ? 'bg-accent' : ''}`}
        title="Bullet List"
      >
        •
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-accent ${editor.isActive('orderedList') ? 'bg-accent' : ''}`}
        title="Numbered List"
      >
        1.
      </button>

      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-2 rounded hover:bg-accent"
        title="Horizontal Line"
      >
        ―
      </button>

      <div className="flex items-center gap-2">
        <select
          value={imageSize}
          onChange={(e) => setImageSize(e.target.value)}
          className="h-8 rounded border border-input bg-transparent px-2 text-sm"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>

        <ImageUpload onUpload={addImage}>
          <button
            type="button"
            className="p-2 rounded hover:bg-accent"
            title="Add Image"
          >
            🖼️
          </button>
        </ImageUpload>
      </div>
    </div>
  )
}

export const editorStyles = {
  content: `
    > * + * {
      margin-top: 0.75em;
    }
    
    p {
      margin: 1em 0;
    }

    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 1em auto;
      border-radius: 0.5rem;
    }

    ul,
    ol {
      padding: 0 1rem;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.1;
      font-weight: 700;
      margin-top: 2em;
      margin-bottom: 0.5em;
    }

    code {
      background-color: rgba(97, 97, 97, 0.1);
      color: #616161;
      padding: 0.25em;
      border-radius: 0.25em;
    }

    hr {
      margin: 1em 0;
      border: none;
      border-top: 2px solid rgba(13, 13, 13, 0.1);
    }
  `
} 