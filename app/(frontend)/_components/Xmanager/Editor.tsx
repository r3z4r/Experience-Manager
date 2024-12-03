"use client";

import { useEffect, useRef, useState } from "react";
import grapesjs, { Editor as GrapesEditor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import webpage from "grapesjs-preset-webpage";
import plugin from "grapesjs-blocks-basic";
import { defaultTemplate } from "@/app/(frontend)/_components/Xmanager/default-template";
import { SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  fetchTemplateById, 
  updateTemplate, 
  createTemplate 
} from '@/app/(frontend)/_actions/templates'
import { toast } from "sonner";

interface EditorProps {
  templateId?: string;
  mode?: "edit" | "view";
  onSave?: () => void; // Callback to refresh template list
}

const Editor = ({ templateId, mode = "edit", onSave }: EditorProps) => {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<GrapesEditor | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = grapesjs.init({
      container: editorRef.current,
      fromElement: true,
      height: "93vh",
      width: "100%",
      storageManager: {
        type: 'remote',
        autosave: true,
        autoload: true,
        stepsBeforeSave: 1,
        options: {
          remote: {
            onLoad: async () => {
              if (!templateId) {
                return {
                  components: defaultTemplate.html,
                  style: defaultTemplate.css,
                };
              }

              try {
                const template = await fetchTemplateById(templateId);
                if (!template) {
                  toast.error('Template not found');
                  return {
                    components: defaultTemplate.html,
                    style: defaultTemplate.css,
                  };
                }

                setTemplateName(template.title || '');
                setTemplateDescription(template.description || '');

                // If template exists, use its data or fall back to defaults
                return template.gjsData || {
                  components: template.htmlContent || defaultTemplate.html,
                  style: template.cssContent || defaultTemplate.css,
                };
              } catch (error) {
                console.error('Error loading template:', error);
                toast.error('Failed to load template');
                return {
                  components: defaultTemplate.html,
                  style: defaultTemplate.css,
                };
              }
            },
            onStore: async (data: unknown) => {
              try {
                const templateData = {
                  title: templateName,
                  description: templateDescription,
                  htmlContent: editor.getHtml(),
                  cssContent: editor.getCss(),
                  gjsData: editor.getProjectData(),
                };

                if (templateId) {
                  await updateTemplate(templateId, templateData);
                } else {
                  const newTemplate = await createTemplate({
                    ...templateData,
                    htmlContent: defaultTemplate.html,
                    cssContent: defaultTemplate.css,
                  });
                  if (newTemplate?.id) {
                    router.replace(`/editor/${newTemplate.id}`);
                  }
                }

                setHasUnsavedChanges(false);
                toast.success(templateId ? 'Template updated' : 'Template created');
                return true;
              } catch (error) {
                console.error('Error saving template:', error);
                toast.error('Failed to save template');
                return false;
              }
            },
            contentTypeJson: true,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        },
      },
      plugins: [webpage, "grapesjs-plugin-export", plugin],
      blockManager: {
        // appendTo: "#block",
        blocks: [
          {
            label: "Hero Section",
            content: `
              <section class="hero-section">
                <h1>Welcome to Your Landing Page</h1>
                <p>This is a hero section created using GrapesJS</p>
              </section>
            `,
            category: "Basic",
          },
          {
            label: "Form",
            content: `
              <form>
                <input type="text" placeholder="Your Name" />
                <input type="email" placeholder="Your Email" />
                <button type="submit">Submit</button>
              </form>
            `,
            category: "Forms",
          },
        ],
      },
      panels: {
        defaults: [],
      },
    });

    const panelTop = document.querySelector(".panel__top");
    console.log(panelTop);
    if (!panelTop) {
      const newPanel = document.createElement("div");
      newPanel.className = "panel__top";
      editorRef.current.insertBefore(newPanel, editorRef.current.firstChild);
    }

    editor.Commands.add("save-template", {
      run: () => setShowSaveDialog(true),
    });

    setEditor(editor);

    return () => editor.destroy();
  }, [templateId, templateName, templateDescription, router]);

  // Add logic to handle view mode
  useEffect(() => {
    if (mode === "view") {
      // Disable editing capabilities
    }
  }, [mode]);

  // Update hasUnsavedChanges when editor content changes
  useEffect(() => {
    if (!editor) return;

    const handleChange = () => {
      setHasUnsavedChanges(true);
    };

    editor.on("component:update", handleChange);
    editor.on("style:update", handleChange);
    editor.on("canvas:update", handleChange);

    return () => {
      editor.off("component:update", handleChange);
      editor.off("style:update", handleChange);
      editor.off("canvas:update", handleChange);
    };
  }, [editor]);

  // Handle beforeunload event
  useEffect(() => {
    if (hasUnsavedChanges) {
      const handleBeforeUnload = () => {
        return window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        );
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () =>
        window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  }, [hasUnsavedChanges]);

  const handleSaveTemplate = async () => {
    if (!editor) return;
    if (!templateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    setSaveStatus("saving");

    try {
      const pageData = {
        title: templateName,
        description: templateDescription,
        htmlContent: editor.getHtml(),
        cssContent: editor.getCss(),
        gjsData: editor.getProjectData(),
      };

      const savedTemplate = templateId 
        ? await updateTemplate(templateId, pageData)
        : await createTemplate(pageData);

      if (savedTemplate?.id) {
        setHasUnsavedChanges(false);
        setSaveStatus("saved");
        setShowSaveDialog(false);
        onSave?.();

        if (!templateId) {
          router.push(`/editor/${savedTemplate.id}`);
        }

        toast.success(
          templateId
            ? "Template updated successfully"
            : "New template created successfully"
        );

        setTimeout(() => setSaveStatus("idle"), 2000);
      }
    } catch (error) {
      console.error("Error saving template:", error);
      setSaveStatus("error");
      toast.error("Failed to save template");
    }
  };

  return (
    <>
      <div className="editor-container">
        <div ref={editorRef} className="gjs-editor"></div>
        <div
          className="panel__top"
          style={{
            padding: "10px",
            background: "#f5f5f5",
            borderBottom: "1px solid #ddd",
          }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <SaveIcon className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Modal using Tailwind */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Save Template</h3>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Enter template name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Enter template description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between mt-4">
                <span
                  className={`text-sm ${
                    saveStatus === "error"
                      ? "text-red-500"
                      : saveStatus === "saved"
                        ? "text-green-500"
                        : saveStatus === "saving"
                          ? "text-blue-500"
                          : "text-gray-500"
                  }`}
                >
                  {saveStatus === "error" && "Failed to save"}
                  {saveStatus === "saved" && "Saved successfully"}
                  {saveStatus === "saving" && "Saving..."}
                </span>

                <button
                  onClick={handleSaveTemplate}
                  disabled={saveStatus === "saving"}
                  className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md 
                    ${
                      saveStatus === "saving"
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-600"
                    } 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  {saveStatus === "saving"
                    ? "Saving..."
                    : templateId
                      ? "Update Template"
                      : "Save Template"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Editor;
