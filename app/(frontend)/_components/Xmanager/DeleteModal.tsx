'use client'

interface DeleteModalProps {
  templateName: string
  onClose: () => void
  onConfirm: () => void
  deleteStatus: 'idle' | 'deleting' | 'deleted' | 'error'
}

export function DeleteModal({ templateName, onClose, onConfirm, deleteStatus }: DeleteModalProps) {
  return (
    <div className="editor-modal-overlay">
      <div className="editor-modal">
        <div className="editor-modal-header">
          <h3 className="editor-modal-title">Delete Template</h3>
          <button onClick={onClose} className="editor-modal-close">
            ✕
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <p className="text-center text-lg font-medium text-gray-900 my-4">Are you sure?</p>
            <p className="text-sm text-gray-500">
              This will permanently delete <span className="font-medium">"{templateName}"</span>.
              This action cannot be undone.
            </p>
          </div>

          <div className="flex items-center justify-between mt-6">
            <span
              className={`editor-status-text ${
                deleteStatus === 'error'
                  ? 'editor-status-error'
                  : deleteStatus === 'deleted'
                    ? 'editor-status-success'
                    : deleteStatus === 'deleting'
                      ? 'editor-status-saving'
                      : 'editor-status-idle'
              }`}
            >
              {deleteStatus === 'error' && 'Failed to delete'}
              {deleteStatus === 'deleted' && 'Deleted successfully'}
              {deleteStatus === 'deleting' && 'Deleting...'}
            </span>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={deleteStatus === 'deleting'}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteStatus === 'deleting' ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
