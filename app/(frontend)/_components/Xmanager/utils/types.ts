export interface EditorProps {
  templateId?: string
  mode?: 'edit' | 'view'
}

export interface ServerError {
  type: 'server'
  message: string
  statusCode?: number
}

export interface NetworkError {
  type: 'network'
  message: string
}

export type TemplateError = ServerError | NetworkError
