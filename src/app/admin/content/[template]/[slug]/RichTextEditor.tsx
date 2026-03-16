'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

// ─── Toolbar button ────────────────────────────────────────────────────────────

function ToolbarButton({
  onClick,
  isActive,
  title,
  children,
}: {
  onClick: () => void
  isActive?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault()
        onClick()
      }}
      title={title}
      className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
        isActive
          ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
      }`}
    >
      {children}
    </button>
  )
}

// ─── RichTextEditor ───────────────────────────────────────────────────────────

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'nofollow noreferrer',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? 'Start typing…',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  function handleSetLink() {
    const previousUrl = editor?.getAttributes('link').href as string | undefined
    const url = window.prompt('URL:', previousUrl ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run()
  }

  function handleClearFormatting() {
    editor?.chain().focus().clearNodes().unsetAllMarks().run()
  }

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <strong>B</strong>
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <em>I</em>
        </ToolbarButton>

        <div className="w-px h-4 bg-gray-200 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarButton>

        <div className="w-px h-4 bg-gray-200 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet list"
        >
          • List
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Ordered list"
        >
          1. List
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        >
          ❝
        </ToolbarButton>

        <div className="w-px h-4 bg-gray-200 mx-1" />

        <ToolbarButton
          onClick={handleSetLink}
          isActive={editor.isActive('link')}
          title="Add / edit link"
        >
          Link
        </ToolbarButton>

        {editor.isActive('link') && (
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Remove link"
          >
            Unlink
          </ToolbarButton>
        )}

        <div className="w-px h-4 bg-gray-200 mx-1" />

        <ToolbarButton onClick={handleClearFormatting} title="Clear formatting">
          Clear
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none px-3 py-2 min-h-[120px] text-gray-900 focus-within:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[120px] [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
      />
    </div>
  )
}
