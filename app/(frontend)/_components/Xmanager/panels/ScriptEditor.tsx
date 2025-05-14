'use client'

import { useEffect, useState } from 'react'
import { Editor as GrapesEditor, Component as GrapesComponent } from 'grapesjs'
import { Button } from '@/app/(frontend)/_components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/(frontend)/_components/ui/dialog'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/(frontend)/_components/ui/tabs'
import { Play, Save, X, Code, Plus } from 'lucide-react'

interface ScriptEditorProps {
  editor: GrapesEditor | null
}

export const ScriptEditor = ({ editor }: ScriptEditorProps) => {
  const [open, setOpen] = useState(false)
  const [activeComponent, setActiveComponent] = useState<GrapesComponent | null>(null)
  const [scriptContent, setScriptContent] = useState('')
  const [scriptList, setScriptList] = useState<Array<GrapesComponent>>([])
  const [activeTab, setActiveTab] = useState('scripts') // Changed default tab to scripts list

  // Update script list when editor changes and listen for events
  useEffect(() => {
    if (!editor) return

    const updateScriptList = () => {
      console.log('Updating script list...')
      const wrapper = editor.Components.getWrapper()
      if (wrapper) {
        const scripts = wrapper.find('[type=script]')
        // Convert to array to avoid type issues
        const scriptsArray = Array.isArray(scripts) ? scripts : []
        console.log('Found scripts:', scriptsArray.length)
        setScriptList(scriptsArray)
      }
    }

    // Initial load
    updateScriptList()

    // Listen for all relevant changes that might affect scripts
    editor.on('component:add', updateScriptList)
    editor.on('component:remove', updateScriptList)
    editor.on('component:update', updateScriptList)
    editor.on('component:update:components', updateScriptList)
    editor.on('canvas:drop', updateScriptList)
    
    // Also listen for dialog open/close to refresh the list
    const handleOpenChange = (open: boolean) => {
      if (open) {
        // When dialog opens, refresh the script list
        updateScriptList()
      }
    }

    // Custom command to open script editor
    editor.Commands.add('open-script-editor', {
      run: (editor, sender, options = {}) => {
        const component = options.component
        if (component && component.get('type') === 'script') {
          setActiveComponent(component)
          const content = component.components().models[0]?.get('content') || ''
          setScriptContent(content)
          setOpen(true)
        }
      }
    })
    
    // Listen for custom event to open script editor dialog
    const handleOpenScriptEditorDialog = (event: CustomEvent) => {
      const { component, editor: eventEditor } = event.detail
      
      // Force a complete refresh of the script list
      setTimeout(() => {
        // This ensures we get the latest state after any pending operations
        updateScriptList()
        
        if (component) {
          // Open with specific component
          setActiveComponent(component)
          const content = component.components().models[0]?.get('content') || ''
          setScriptContent(content)
        } else {
          // Reset for new script creation
          setActiveComponent(null)
          setScriptContent('// New JavaScript code\nconsole.log("New script added");')
        }
        
        // Open the dialog
        setOpen(true)
      }, 50) // Small timeout to ensure DOM is updated
    }

    // Add event listener for custom events
    window.addEventListener('open-script-editor-dialog', handleOpenScriptEditorDialog as EventListener)
    
    // Add listener for script list refresh
    const handleRefreshScriptList = () => {
      console.log('Refresh script list event received')
      updateScriptList()
    }
    window.addEventListener('refresh-script-list', handleRefreshScriptList as EventListener)

    return () => {
      editor.off('component:add', updateScriptList)
      editor.off('component:remove', updateScriptList)
      editor.off('component:update', updateScriptList)
      editor.off('component:update:components', updateScriptList)
      editor.off('canvas:drop', updateScriptList)
      window.removeEventListener('open-script-editor-dialog', handleOpenScriptEditorDialog as EventListener)
      window.removeEventListener('refresh-script-list', handleRefreshScriptList as EventListener)
    }
  }, [editor])

  // Handle script selection
  const handleScriptSelect = (script: GrapesComponent) => {
    setActiveComponent(script)
    const content = script.components().models[0]?.get('content') || ''
    setScriptContent(content)
    setOpen(true)
  }

  // Save script changes
  const handleSaveScript = () => {
    if (!editor || !activeComponent) {
      // If no active component, create a new one
      handleCreateScript()
      return
    }

    try {
      // Find the text node within the script component
      const textNode = activeComponent.components().models[0]
      
      if (textNode) {
        // Update the content
        textNode.set('content', scriptContent)
        activeComponent.set('scriptContent', scriptContent)
        
        // Force re-render
        if (activeComponent.view) {
          activeComponent.view.render()
        } else {
          // If view doesn't exist, try to update the component
          editor.select(activeComponent)
          const selected = editor.getSelected()
          if (selected && selected.view) {
            selected.view.render()
          }
        }
        
        // Show success message
        toast.success('Script updated successfully')
        
        // Go back to scripts list
        setActiveTab('scripts')
      } else {
        // If no text node found, recreate the component structure
        activeComponent.components([{
          type: 'textnode',
          content: scriptContent
        }])
        
        // Force re-render
        editor.select(activeComponent)
        const selected = editor.getSelected()
        if (selected && selected.view) {
          selected.view.render()
        }
        
        toast.success('Script updated successfully')
        setActiveTab('scripts')
      }
      
      // Update script list
      const wrapper = editor.Components.getWrapper()
      if (wrapper) {
        const scripts = wrapper.find('[type=script]')
        setScriptList(Array.isArray(scripts) ? scripts : [])
      }
    } catch (error) {
      console.error('Error saving script:', error)
      toast.error('Failed to save script')
    }
  }

  // Execute script
  const handleExecuteScript = () => {
    try {
      // Create a safe function from the script content
      const func = new Function(scriptContent)
      func()
      toast.success('Script executed successfully')
    } catch (error) {
      console.error('Script execution error:', error)
      toast.error(`Script execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Create a new script
  const handleCreateScript = () => {
    if (!editor) return

    // Create default script content
    const defaultContent = '// New JavaScript code\nconsole.log("New script added");'
    
    try {
      // Get the wrapper to add the script to
      const wrapper = editor.Components.getWrapper()
      if (!wrapper) {
        toast.error('Cannot add script: editor wrapper not found')
        return
      }
      
      // Create the script component with proper structure
      const scriptComponent = {
        type: 'script',
        tagName: 'script',
        draggable: true,
        droppable: false,
        layerable: true,
        selectable: true,
        hoverable: true,
        attributes: { type: 'text/javascript' },
        components: [
          {
            type: 'textnode',
            content: defaultContent,
          },
        ],
      }
      
      // Add the component to the wrapper
      const addedComponents = wrapper.append(scriptComponent)
      const component = Array.isArray(addedComponents) && addedComponents.length > 0 ? addedComponents[0] : null
      
      if (component) {
        console.log('Script component added successfully')
        
        // Force the editor to update
        if (component) {
          editor.select(component)
          const selected = editor.getSelected()
          if (selected && selected.view) {
            selected.view.render()
          }
        }
        
        // Set as active component and prepare editor
        setActiveComponent(component)
        setScriptContent(defaultContent)
        setActiveTab('editor')
        
        // Force a complete refresh of the script list
        setTimeout(() => {
          // Manually find all script components
          const wrapper = editor.Components.getWrapper()
          if (!wrapper) {
            console.error('Cannot find editor wrapper')
            return
          }
          
          // Get all components and filter for scripts
          const scripts = wrapper.find('[type=script]')
          const scriptComponents = Array.isArray(scripts) ? scripts : []
          console.log('Found script components:', scriptComponents.length)
          
          // Update the script list
          setScriptList(scriptComponents)
          
          // Open the dialog
          setOpen(true)
          
          // Trigger a global refresh event
          window.dispatchEvent(new CustomEvent('refresh-script-list'))
        }, 200) // Longer delay to ensure everything is updated
      } else {
        toast.error('Failed to add script component')
      }
    } catch (error) {
      console.error('Error creating script:', error)
      toast.error(`Failed to create script: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Add an effect to update the script list when the dialog opens
  useEffect(() => {
    if (open && editor) {
      // When dialog opens, refresh the script list
      const wrapper = editor.Components.getWrapper()
      if (wrapper) {
        const scripts = wrapper.find('[type=script]')
        const scriptsArray = Array.isArray(scripts) ? scripts : []
        console.log('Dialog opened, found scripts:', scriptsArray.length)
        setScriptList(scriptsArray)
      }
    }
  }, [open, editor])
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // When opening, make sure we have the latest script list
      if (newOpen && !open) {
        // Force update script list before opening
        if (editor) {
          const wrapper = editor.Components.getWrapper()
          if (wrapper) {
            const scripts = wrapper.find('[type=script]')
            setScriptList(Array.isArray(scripts) ? scripts : [])
          }
        }
      }
      setOpen(newOpen)
    }}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>JavaScript Manager</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="scripts" className="flex-1 flex flex-col" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="scripts">Scripts</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>
          
          {/* Scripts List Tab */}
          <TabsContent value="scripts" className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium">JavaScript Scripts</h3>
              <Button 
                onClick={handleCreateScript}
                size="sm"
                variant="outline"
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add New Script
              </Button>
            </div>

            {scriptList.length === 0 ? (
              <div className="text-center py-12 px-4 border-2 border-dashed rounded-md bg-gray-50">
                <Code className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 mb-4">No scripts added yet</p>
                <Button 
                  onClick={handleCreateScript}
                  variant="outline"
                  className="mx-auto"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Your First Script
                </Button>
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-[400px] border rounded-md p-2">
                {scriptList.map((script, index) => {
                  const content = script.components().models[0]?.get('content') || ''
                  
                  // Extract first line as title (if it's a comment)
                  const firstLine = content.split('\n')[0]
                  const title = firstLine.startsWith('//') 
                    ? firstLine.substring(2).trim() 
                    : 'JavaScript Script ' + (index + 1)
                  
                  // Get a preview of the content
                  const previewContent = content.replace(firstLine, '').trim()
                  const preview = previewContent.substring(0, 50) + (previewContent.length > 50 ? '...' : '')
                  
                  return (
                    <div 
                      key={index} 
                      className="p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleScriptSelect(script)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <div className="w-5 h-5 mr-2 flex items-center justify-center bg-yellow-100 rounded">
                            <span className="text-yellow-600 text-xs font-mono">JS</span>
                          </div>
                          <span className="font-medium">{title}</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveComponent(script)
                              const content = script.components().models[0]?.get('content') || ''
                              setScriptContent(content)
                              handleExecuteScript()
                            }}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleScriptSelect(script)
                            }}
                          >
                            <Code className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {preview && (
                        <div className="font-mono text-xs text-gray-500 mt-1 bg-gray-50 p-1 rounded overflow-hidden text-ellipsis">
                          {preview}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </TabsContent>
          
          {/* Editor Tab */}
          <TabsContent value="editor" className="flex-1 flex flex-col">
            <div className="flex-1 min-h-[400px] border rounded-md p-1">
              <textarea
                className="w-full h-full font-mono text-sm p-2 focus:outline-none resize-none"
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                placeholder="// Write your JavaScript code here"
              />
            </div>
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setActiveTab('scripts')}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={handleExecuteScript}>
                  <Play className="h-4 w-4 mr-2" />
                  Test Run
                </Button>
                <Button onClick={handleSaveScript}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Help Tab */}
          <TabsContent value="help" className="flex-1 overflow-auto">
            <div className="space-y-4 p-4">
              <h3 className="text-lg font-medium">JavaScript in Page Editor</h3>
              <p>
                You can add JavaScript code to enhance your page with dynamic functionality.
                The script will be executed when the page loads.
              </p>
              
              <h4 className="font-medium mt-4">Tips:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Scripts are executed in the browser when the page loads</li>
                <li>You can access DOM elements using standard methods like <code className="bg-gray-100 px-1 rounded">document.getElementById()</code></li>
                <li>Add event listeners to make your page interactive</li>
                <li>Use the "Test Run" button to check your script before saving</li>
                <li>Be careful with external API calls and ensure proper error handling</li>
              </ul>
              
              <h4 className="font-medium mt-4">Example:</h4>
              <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto">
{`// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get reference to an element with id "myButton"
  const button = document.getElementById('myButton');
  
  // Add click event listener
  if (button) {
    button.addEventListener('click', () => {
      alert('Button clicked!');
    });
  }
});`}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
