import { useState, useEffect, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { useParams } from 'react-router-dom'
import { apiService } from '../../lib/api'
import debounce from 'lodash/debounce'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Link from '@tiptap/extension-link'
import Tags from '../Tags'

import { SimpleEditor } from '../tiptap-templates/simple/simple-editor'
import Image from '@tiptap/extension-image'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'

const TitleEditor = ({ content, onChange }) => {
  const { pageId } = useParams()
  const [isSaving, setIsSaving] = useState(false)

  const debouncedSave = useCallback(
    debounce(async (newTitle) => {
      if (!pageId) return
      
      try {
        setIsSaving(true)
        await apiService.updatePage(pageId, { title: newTitle })
      } catch (error) {
        console.error('Failed to save title:', error)
      } finally {
        setIsSaving(false)
      }
    }, 1000),
    [pageId]
  )

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Placeholder.configure({
        placeholder: 'page title',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const newTitle = editor.getText().trim()
      onChange(newTitle)
      debouncedSave(newTitle)
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none text-4xl font-bold text-gray-900',
      },
    },
  })

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel()
    }
  }, [debouncedSave])

  return (
    <div className="w-full relative">
      <EditorContent editor={editor} />
      {isSaving && (
        <div className="absolute top-2 right-2 text-xs text-gray-500">
          Saving...
        </div>
      )}
    </div>
  )
}

const ContentEditor = ({ content, onChange }) => {
  const { pageId } = useParams()
  const [isSaving, setIsSaving] = useState(false)
  const [suggestedTags, setSuggestedTags] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [isAddingTag, setIsAddingTag] = useState(false)

  const debouncedSave = useCallback(
    debounce(async (newContent) => {
      if (!pageId) return

      try {
        setIsSaving(true)
        const response = await apiService.updatePage(pageId, { content: newContent })
        if (response.tags) {
          setSuggestedTags(response.tags)
        }
      } catch (error) {
        console.error('Failed to save page:', error)
      } finally {
        setIsSaving(false)
      }
    }, 1000),
    [pageId]
  )

  const handleContentChange = (newContent) => {
    onChange(newContent)
    debouncedSave(newContent)
  }

  const handleTagClick = async (tag) => {
    if (!pageId || isAddingTag) return;

    try {
      setIsAddingTag(true);
      const updatedPage = await apiService.addTagToPage(pageId, tag);
      setSelectedTags(updatedPage.tags || []);
      // Remove the clicked tag from suggested tags
      setSuggestedTags(prevTags => prevTags.filter(t => t !== tag));
    } catch (error) {
      console.error('Failed to add tag:', error);
    } finally {
      setIsAddingTag(false);
    }
  }

  // Load initial tags when component mounts
  useEffect(() => {
    const loadPageTags = async () => {
      if (!pageId) return;
      try {
        const page = await apiService.getPage(pageId);
        if (page?.tags) {
          setSelectedTags(page.tags);
        }
      } catch (error) {
        console.error('Failed to load page tags:', error);
      }
    };
    loadPageTags();
  }, [pageId]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel()
    }
  }, [debouncedSave])

  return (
    <div className="w-full" style={{ color: 'black' }}>
      <div className="relative">
        <SimpleEditor content={content} onChange={handleContentChange} />
        {isSaving && (
          <div className="absolute top-2 right-2 text-xs text-gray-500">
            Saving...
          </div>
        )}
      </div>
      {selectedTags.length > 0 && (
        <Tags 
          tags={selectedTags} 
          onTagClick={handleTagClick}
          variant="selected"
        />
      )}
      {suggestedTags.length > 0 && (
        <Tags 
          tags={suggestedTags} 
          onTagClick={handleTagClick}
          variant="suggested"
        />
      )}
    </div>
  )
}


const Editor = ({ content, onChange }) => {
  const { pageId } = useParams()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadPageData = async () => {
      if (!pageId) return
      
      try {
        setIsLoading(true)
        const page = await apiService.getPage(pageId)
        if (page) {
          onChange({
            title: page.title || { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }] },
            content: page.content || { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }] }
          })
        }
      } catch (error) {
        console.error('Failed to load page:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPageData()
  }, [pageId])

  const handleTitleChange = (newTitle) => {
    onChange({
      ...content,
      title: newTitle
    })
  }

  const handleContentChange = (newContent) => {
    onChange({
      ...content,
      content: newContent
    })
  }

  if (isLoading) {
    return (
      <div className="w-full rounded-lg border border-gray-200 bg-white p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white">
      <div className="p-4">
        <TitleEditor 
          content={content?.title || { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }] }} 
          onChange={handleTitleChange} 
        />
      </div>
      <div className="border-t border-gray-200">
        <ContentEditor 
          content={content?.content || { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }] }} 
          onChange={handleContentChange} 
        />
      </div>
    </div>
  )
}

export default Editor 