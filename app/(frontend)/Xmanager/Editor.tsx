"use client";

import { useEffect, useRef, useState } from "react";
import grapesjs, { Editor as GrapesEditor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import webpage from "grapesjs-preset-webpage";
import plugin from "grapesjs-blocks-basic";
import { defaultTemplate } from "@/app/(frontend)/api/templates/default/route";
import { SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";

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
        type: "remote",
        autosave: true,
        autoload: true,
        stepsBeforeSave: 1,
        options: {
          remote: {
            contentTypeJson: true,
            headers: {
              "Content-Type": "application/json",
            },
            urlStore: templateId
              ? `/api/templates/${templateId}`
              : "/api/templates",
            urlLoad: templateId ? `/api/templates/${templateId}` : undefined,
            onStore: (data, editor) => {
              return {
                name: templateName,
                description: templateDescription,
                html: editor.getHtml(),
                css: editor.getCss(),
                gjsData: editor.getProjectData(),
              };
            },
            onLoad: (result) => {
              if (!result) {
                return defaultTemplate;
              }
              return result.gjsData;
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

    // Modified template loading logic
    if (templateId) {
      fetch(`/api/templates/${templateId}`)
        .then((res) => res.json())
        .then((template) => {
          if (template) {
            editor.loadProjectData(template.gjsData);
            // Set the name and description for existing templates
            setTemplateName(template.name || "");
            setTemplateDescription(template.description || "");
          }
        })
        .catch((error) => {
          console.error("Error loading template:", error);
          editor.setComponents(defaultTemplate.html);
          editor.setStyle(defaultTemplate.css);
        });
    } else {
      // For new templates, load default template
      editor.setComponents(defaultTemplate.html);
      editor.setStyle(defaultTemplate.css);
    }

    return () => editor.destroy();
  }, [templateId]);

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
      alert("Please enter a template name");
      return;
    }

    setSaveStatus("saving");

    try {
      const html = editor.getHtml();
      const css = editor.getCss();
      const gjsData = editor.getProjectData();

      const response = await fetch("/api/templates", {
        method: templateId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(templateId && { id: templateId }), // Only include id if it exists
          name: templateName,
          description: templateDescription,
          html,
          css,
          gjsData,
        }),
      });

      if (!response.ok) throw new Error("Failed to save template");

      const savedTemplate = await response.json();

      // Update URL with new template ID for new templates
      if (!templateId) {
        router.push(`/editor/${savedTemplate.id}`);
      }

      setHasUnsavedChanges(false); // Reset after successful save
      setSaveStatus("saved");
      setShowSaveDialog(false);
      onSave?.(); // Refresh template list

      // Show success message
      alert(
        templateId
          ? "Template updated successfully"
          : "New template created successfully"
      );

      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Error saving template:", error);
      setSaveStatus("error");
      alert("Failed to save template. Please try again.");
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
