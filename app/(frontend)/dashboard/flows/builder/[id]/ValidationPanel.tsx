'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { AlertCircle, CheckCircle, AlertTriangle, Eye, Upload, Archive, RotateCcw } from 'lucide-react'
import { validateFlowAction, publishFlowAction, unpublishFlowAction, archiveFlowAction } from '@/app/(frontend)/_actions/flows'
import type { ValidationResult } from '@/lib/flowValidation'

interface Props {
  flowId: string
  flowStatus: 'draft' | 'approved' | 'archived'
  nodes: any[]
  edges: any[]
  onStatusChange?: (newStatus: 'draft' | 'approved' | 'archived') => void
}

export default function ValidationPanel({ flowId, flowStatus, nodes, edges, onStatusChange }: Props) {
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleValidate = useCallback(async () => {
    setIsValidating(true)
    try {
      const result = await validateFlowAction(flowId)
      setValidation(result)
    } catch (error) {
      console.error('Validation failed:', error)
      setValidation(null)
    } finally {
      setIsValidating(false)
    }
  }, [flowId])

  // Auto-validate when nodes or edges change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleValidate()
    }, 1000) // Debounce validation

    return () => clearTimeout(timeoutId)
  }, [nodes, edges, handleValidate])

  const handlePublish = async () => {
    setIsPublishing(true)
    setMessage(null)
    
    try {
      const result = await publishFlowAction(flowId)
      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        onStatusChange?.('approved')
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to publish flow' })
    } finally {
      setIsPublishing(false)
    }
  }

  const handleUnpublish = async () => {
    setIsPublishing(true)
    setMessage(null)
    
    try {
      const result = await unpublishFlowAction(flowId)
      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        onStatusChange?.('draft')
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to unpublish flow' })
    } finally {
      setIsPublishing(false)
    }
  }

  const handleArchive = async () => {
    if (!confirm('Are you sure you want to archive this flow? This will make it unavailable for execution.')) {
      return
    }

    setIsPublishing(true)
    setMessage(null)
    
    try {
      const result = await archiveFlowAction(flowId)
      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        onStatusChange?.('archived')
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to archive flow' })
    } finally {
      setIsPublishing(false)
    }
  }

  const getStatusBadge = () => {
    switch (flowStatus) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Published
          </span>
        )
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            <Archive className="w-3 h-3" />
            Archived
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            <AlertCircle className="w-3 h-3" />
            Draft
          </span>
        )
    }
  }

  const getValidationIcon = () => {
    if (isValidating) {
      return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    }
    
    if (!validation) {
      return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
    
    if (validation.isValid && validation.warnings.length === 0) {
      return <CheckCircle className="w-4 h-4 text-green-600" />
    }
    
    if (validation.isValid) {
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />
    }
    
    return <AlertCircle className="w-4 h-4 text-red-600" />
  }

  const getValidationText = () => {
    if (isValidating) return 'Validating...'
    if (!validation) return 'Click to validate'
    
    if (validation.isValid && validation.warnings.length === 0) {
      return 'Flow is valid and ready to publish'
    }
    
    if (validation.isValid) {
      return `Valid with ${validation.warnings.length} warning${validation.warnings.length > 1 ? 's' : ''}`
    }
    
    return `${validation.errors.length} error${validation.errors.length > 1 ? 's' : ''} must be fixed`
  }

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium text-gray-900">Flow Status</h3>
          {getStatusBadge()}
        </div>
        
        <div className="flex items-center gap-2">
          {flowStatus === 'approved' && (
            <>
              <button
                onClick={handleUnpublish}
                disabled={isPublishing}
                className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                <RotateCcw className="w-3 h-3" />
                Unpublish
              </button>
              <button
                onClick={handleArchive}
                disabled={isPublishing}
                className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                <Archive className="w-3 h-3" />
                Archive
              </button>
            </>
          )}
          
          {flowStatus === 'draft' && (
            <button
              onClick={handlePublish}
              disabled={isPublishing || !validation?.isValid}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPublishing ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-3 h-3" />
              )}
              Publish
            </button>
          )}
          
          {flowStatus === 'archived' && (
            <button
              onClick={handleUnpublish}
              disabled={isPublishing}
              className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <RotateCcw className="w-3 h-3" />
              Restore
            </button>
          )}
        </div>
      </div>

      {/* Validation Status */}
      <div className="mb-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-gray-50"
        >
          {getValidationIcon()}
          <span className="text-sm text-gray-700">{getValidationText()}</span>
          <Eye className="w-3 h-3 text-gray-400 ml-auto" />
        </button>
      </div>

      {/* Validation Details */}
      {showDetails && validation && (
        <div className="space-y-2 text-xs">
          {validation.errors.map((error) => (
            <div key={error.id} className="flex items-start gap-2 p-2 bg-red-50 rounded">
              <AlertCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
              <span className="text-red-800">{error.message}</span>
            </div>
          ))}
          
          {validation.warnings.map((warning) => (
            <div key={warning.id} className="flex items-start gap-2 p-2 bg-yellow-50 rounded">
              <AlertTriangle className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span className="text-yellow-800">{warning.message}</span>
            </div>
          ))}
          
          {validation.isValid && validation.warnings.length === 0 && (
            <div className="flex items-start gap-2 p-2 bg-green-50 rounded">
              <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-green-800">All validations passed successfully</span>
            </div>
          )}
        </div>
      )}

      {/* Status Messages */}
      {message && (
        <div className={`mt-3 p-2 rounded text-xs ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800' 
            : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  )
}
