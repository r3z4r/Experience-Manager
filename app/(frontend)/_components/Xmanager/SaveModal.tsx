'use client'

import { useState } from 'react'
import { Button } from '@/app/(frontend)/_components/ui/button'
import { generateSlug } from '@/lib/utils/slug-generator'

interface SaveModalProps {
  templateId?: string
  initialName: string
  initialDescription: string
  slugValue: string
  slugTempValue: string
  onSlugChange: (value: string) => void
  onClose: () => void
  onSave: (name: string, description: string) => void
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
}

export function SaveModal({
  templateId,
  initialName,
  initialDescription,
  slugValue,
  slugTempValue,
  onSlugChange,
  onClose,
  onSave,
  saveStatus,
}: SaveModalProps) {
  const [templateName, setTemplateName] = useState(initialName)
  const [templateDescription, setTemplateDescription] = useState(initialDescription)

  const handleSave = () => {
    onSave(templateName, templateDescription)
  }

  return (
    <div className="editor-modal-overlay">
      <div className="editor-modal">
        <div className="editor-modal-header">
          <h3 className="editor-modal-title">Save Template</h3>
          <button onClick={onClose} className="editor-modal-close">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="editor-form-field">
            <label className="editor-form-label">Template Name</label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
              className="editor-form-input"
            />
          </div>

          <div className="editor-form-field">
            <label className="editor-form-label">URL Slug</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={slugTempValue}
                onChange={(e) => onSlugChange(e.target.value)}
                placeholder="custom-url-slug"
                className="editor-form-input flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={async () => {
                  const generatedSlug = await generateSlug(templateName)
                  onSlugChange(generatedSlug)
                }}
                className="whitespace-nowrap"
              >
                Generate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This will be used in the URL: /pages/
              <span className="font-mono">{slugValue || 'your-slug'}</span>
            </p>
          </div>

          <div className="editor-form-field">
            <label className="editor-form-label">Description</label>
            <input
              type="text"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="Enter template description"
              className="editor-form-input"
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <span
              className={`editor-status-text ${
                saveStatus === 'error'
                  ? 'editor-status-error'
                  : saveStatus === 'saved'
                    ? 'editor-status-success'
                    : saveStatus === 'saving'
                      ? 'editor-status-saving'
                      : 'editor-status-idle'
              }`}
            >
              {saveStatus === 'error' && 'Failed to save'}
              {saveStatus === 'saved' && 'Saved successfully'}
              {saveStatus === 'saving' && 'Saving...'}
            </span>

            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`editor-save-button ${
                saveStatus === 'saving' ? 'editor-save-button-disabled' : ''
              }`}
            >
              {saveStatus === 'saving'
                ? 'Saving...'
                : templateId
                  ? 'Update Template'
                  : 'Save Template'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
