'use client'

import React, { useState, useEffect } from 'react'
import { Settings, Save, Code, Database, Play, X } from 'lucide-react'
import { toast } from 'sonner'

interface ContextEditorProps {
  initialContext?: Record<string, any>
  onSaveContext: (context: Record<string, any>) => void
  onClose: () => void
}

export default function ContextEditor({ initialContext = {}, onSaveContext, onClose }: ContextEditorProps) {
  const [jsonMode, setJsonMode] = useState(true)
  const [contextJson, setContextJson] = useState('')
  const [apiUrl, setApiUrl] = useState('')
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST'>('GET')
  const [apiHeaders, setApiHeaders] = useState('')
  const [apiBody, setApiBody] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [jsonError, setJsonError] = useState<string | null>(null)

  // Initialize context JSON from props
  useEffect(() => {
    try {
      setContextJson(JSON.stringify(initialContext, null, 2) || '{}')
    } catch (error) {
      setContextJson('{}')
    }
  }, [initialContext])

  const handleSaveContext = () => {
    try {
      const parsedContext = JSON.parse(contextJson)
      onSaveContext(parsedContext)
      toast.success('Flow context updated successfully')
    } catch (error) {
      setJsonError('Invalid JSON format')
      toast.error('Failed to save context: Invalid JSON format')
    }
  }

  const handleLoadFromApi = async () => {
    if (!apiUrl) {
      toast.error('API URL is required')
      return
    }

    setIsLoading(true)
    setJsonError(null)

    try {
      let headers: Record<string, string> = {}
      
      // Parse headers if provided
      if (apiHeaders.trim()) {
        try {
          headers = JSON.parse(apiHeaders)
        } catch (error) {
          throw new Error('Invalid headers JSON format')
        }
      }

      // Add default content-type for POST requests if not specified
      if (apiMethod === 'POST' && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json'
      }

      // Prepare request options
      const requestOptions: RequestInit = {
        method: apiMethod,
        headers,
      }

      // Add body for POST requests
      if (apiMethod === 'POST' && apiBody.trim()) {
        try {
          const parsedBody = JSON.parse(apiBody)
          requestOptions.body = JSON.stringify(parsedBody)
        } catch (error) {
          throw new Error('Invalid request body JSON format')
        }
      }

      // Make the API call
      const response = await fetch(apiUrl, requestOptions)
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Update context JSON with API response
      setContextJson(JSON.stringify(data, null, 2))
      toast.success('Context loaded from API successfully')
    } catch (error) {
      setJsonError(`API error: ${error instanceof Error ? error.message : String(error)}`)
      toast.error(`Failed to load context: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full h-full bg-white overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Flow Context Editor
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setJsonMode(true)}
                className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
                  jsonMode ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Code className="w-3 h-3" />
                JSON Editor
              </button>
              <button
                onClick={() => setJsonMode(false)}
                className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
                  !jsonMode ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Database className="w-3 h-3" />
                Load from API
              </button>
            </div>
            <button
              onClick={handleSaveContext}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              <Save className="w-3 h-3" />
              Save Context
            </button>
          </div>
        </div>

        {jsonMode ? (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Initial Context (JSON)
            </label>
            <div className="relative">
              <textarea
                value={contextJson}
                onChange={(e) => {
                  setContextJson(e.target.value)
                  setJsonError(null)
                }}
                className={`w-full h-80 px-3 py-2 font-mono text-sm border rounded-md focus:outline-none focus:ring-2 ${
                  jsonError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder='{\n  "user": {\n    "role": "customer"\n  },\n  "preferences": {\n    "theme": "dark"\n  }\n}'
              />
              {jsonError && (
                <p className="mt-1 text-xs text-red-600">{jsonError}</p>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <p>Define the initial context that will be available to the flow when it starts.</p>
              <p className="mt-1">This context can be accessed in condition nodes and API configurations.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                API URL
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://api.example.com/data"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Method
              </label>
              <select
                value={apiMethod}
                onChange={(e) => setApiMethod(e.target.value as 'GET' | 'POST')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Headers (JSON)
              </label>
              <textarea
                value={apiHeaders}
                onChange={(e) => setApiHeaders(e.target.value)}
                className="w-full h-20 px-3 py-2 font-mono text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder='{\n  "Authorization": "Bearer token",\n  "Content-Type": "application/json"\n}'
              />
            </div>
            
            {apiMethod === 'POST' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Request Body (JSON)
                </label>
                <textarea
                  value={apiBody}
                  onChange={(e) => setApiBody(e.target.value)}
                  className="w-full h-20 px-3 py-2 font-mono text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder='{\n  "query": "parameters"\n}'
                />
              </div>
            )}
            
            <button
              onClick={handleLoadFromApi}
              disabled={isLoading || !apiUrl}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Load Context from API
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
